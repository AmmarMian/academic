"use client";

import React, { useState, useMemo } from "react";
import * as reactTable from "@tanstack/react-table";
import { User } from "lucide-react";
import { GraduationCap, FlaskConical } from "lucide-react"; // Import the icons
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Dummy data for students with new 'subject' and 'keywords' columns
const studentsData = [
  {
    name: "Olivier Lerda", startDate: "2021-04-01", funding: "Exail Ingeneer", type: "Ph.D", defended: "2024-12-17",
    subject: "Robust Mutivariate Detection for Mill Cross Sonar", keywords: ["Sonar", "Statistical Hypothesis testing", "Robust statistics"]
  },
  {
    name: "Douba Jafuno", startDate: "2022-06-01", funding: "CIFRE with Géolithe", type: "Ph.D", defended: "",
    subject: "Classification of GPR signals with second-order network", keywords: ["Deep learning", "Second-order", "GPR"]
  },
  {
    name: "Matthieu Verlynde", startDate: "2024-10-01", funding: "ED SIE", type: "Ph.D", defended: "",
    subject: "Frugality of ML models in Remote Sensing", keywords: ["Frugal", "AI", "Remote Sensing"]
  },
  {
    name: "Matthieu Gallet", startDate: "2021-02-01", funding: "Research Grant", type: "Master", defended: "2021-09-01",
    subject: "Robust Inversion of GPR signals", keywords: ["GPR", "Inverse methods"]
  },
  {
    name: "Emma Molière", startDate: "2024-02-01", funding: "Research grant", type: "Master", defended: "2024-09-10",
    subject: "Unrolling Pansharpening Inverse methods", keywords: ["Inverse methods", "Unrolling", "Remote Sensing"]
  },
  {
    name: "Matthieu Verlynde", startDate: "2024-02-12", funding: "Research Grant", type: "Master", defended: "2024-09-15",
    subject: "Efficient implementation of Remote Sening algorithms", keywords: ["Energy measurement", "Remote Sensing"]
  },
  {
    name: "Hugo Brehier", startDate: "2024-11-01", funding: "Research Grant", type: "Post-Doc", defended: "",
    subject: "SPDnet and beyond", keywords: ["SPDnet", "Second-order", "Deep Learning"]
  },
];

const StudentsTable: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [columnFilters, setColumnFilters] = useState<reactTable.ColumnFiltersState>([]);

  // Memoize filtered data based on type
  const filteredStudents = useMemo(
    () => studentsData.filter((student) => (typeFilter ? student.type === typeFilter : true)),
    [typeFilter]
  );

  const columns: reactTable.ColumnDef<typeof studentsData[0]>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.getValue<string>("name");
        const type = row.getValue<string>("type");

        return (
          <div className="flex items-center">
            {type === "Master" ? (
              <GraduationCap className="mr-2 text-blue-600" />
            ) : type === "Ph.D" ? (
              <User className="mr-2 text-green-600" />
            ) : type === "Post-Doc" ? (
              <FlaskConical className="mr-2 text-orange-600" />
            ) : null}
            {name}
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: () => (
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {typeFilter ? typeFilter : "Type"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTypeFilter(undefined)}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("Master")}>
                Master
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("Ph.D")}>
                Ph.D
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("Post-Doc")}>
                Post-Doc
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("type")}</div>,
    },
    {
      accessorKey: "startDate",
      header: "Started",
      cell: ({ row }) => <div>{
        row.getValue("startDate") ?
          new Date(row.getValue("startDate")).toLocaleDateString()
          : ""
      }</div>,
    },
    {
      accessorKey: "defended",
      header: "Defended",
      cell: ({ row }) => (
        <div>
          {row.getValue("defended")
            ? new Date(row.getValue("defended")).toLocaleDateString()
            : ""}
        </div>
      ),
    },
    {
      accessorKey: "funding",
      header: "Funding",
      cell: ({ row }) => <div>{row.getValue("funding")}</div>,
    },
    // Subject column with filtering enabled
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => <div>{row.getValue("subject")}</div>,
      filterFn: "includesString",
    },
    // Keywords column with accessorFn for filtering
    {
      id: "keywords",
      accessorFn: (row) => row.keywords.join(" "),
      header: "Keywords",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.original.keywords.map((keyword: string, index: number) => (
            <Badge key={index} variant="secondary">
              {keyword}
            </Badge>
          ))}
        </div>
      ),
      filterFn: "includesString",
    },
  ];

  const table = reactTable.useReactTable({
    data: filteredStudents,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: reactTable.getCoreRowModel(),
    getFilteredRowModel: reactTable.getFilteredRowModel(),
  });

  // Retrieve current filter values for subject and keywords
  const subjectFilter = (table.getColumn("subject")?.getFilterValue() as string) ?? "";
  const keywordsFilter = (table.getColumn("keywords")?.getFilterValue() as string) ?? "";

  return (
    <div className="flex flex-col space-y-8">
      {/* Search Inputs and Type Filter */}
      <div className="justify-center flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search Subject..."
          value={subjectFilter}
          onChange={(e) =>
            table.getColumn("subject")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <Input
          placeholder="Search Keywords..."
          value={keywordsFilter}
          onChange={(e) =>
            table.getColumn("keywords")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {typeFilter ? typeFilter : "Type"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTypeFilter(undefined)}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("Master")}>
              Master
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("Ph.D")}>
              Ph.D
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTypeFilter("Post-Doc")}>
              Post-Doc
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Data Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : reactTable.flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {reactTable.flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-4">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StudentsTable;

