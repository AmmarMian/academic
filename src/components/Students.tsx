"use client";

import React, { useState, useMemo } from "react";
import * as reactTable from "@tanstack/react-table";
import { User } from "lucide-react";
import { GraduationCap, FlaskConical } from "lucide-react"; // Import the icons
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Dummy data for students with new 'subject' and 'keywords' columns
const studentsData = [
  { 
    name: "Olivier Lerda", startDate: "2021-04-01", funding: "Exail Ingeneer", type: "Ph.D", defended: "2024-12-17",
    subject: "Robust Mutivariate Detection for Mill Cross Sonar", keywords: ["Sonar", "Statistical Hypothesis testing", "Robust statistics"]
  },
  { 
    name: "Douba Jafuno", startDate: "2022-06-01", funding: "CIFRE with Géolithe", type: "Ph.D", defended: "",
    subject: "Geology", keywords: ["Data Analysis", "Geophysics"]
  },
  { 
    name: "Matthieu Verlynde", startDate: "2024-10-01", funding: "ED SIE", type: "Ph.D", defended: "",
    subject: "Physics", keywords: ["Quantum Computing", "AI"]
  },
  { 
    name: "Matthieu Gallet", startDate: "2021-02-01", funding: "Research Grant", type: "Master", defended: "2021-09-01",
    subject: "Engineering", keywords: ["Mechanical Engineering", "Robotics"]
  },
  { 
    name: "Emma Molière", startDate: "2024-02-01", funding: "Research grant", type: "Master", defended: "2024-09-10",
    subject: "Biology", keywords: ["Genetics", "Biochemistry"]
  },
  { 
    name: "Matthieu Verlynde", startDate: "2024-02-12", funding: "Research Grant", type: "Master", defended: "2024-09-15",
    subject: "Mathematics", keywords: ["Algebra", "Cryptography"]
  },
  { 
    name: "Hugo Brehier", startDate: "2024-11-01", funding: "Research Grant", type: "Post-Doc", defended: "",
    subject: "Chemistry", keywords: ["Organic Chemistry", "Catalysis"]
  },
];

const StudentsTable: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);

  // Memoize filtered data to prevent recalculating on each render
  const filteredStudents = useMemo(
    () => studentsData.filter((student) => (typeFilter ? student.type === typeFilter : true)),
    [typeFilter]
  );

  const columns: reactTable.ColumnDef<typeof studentsData[0]>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
         const name = row.getValue<string>("name"); // Type the name as string
         const type = row.getValue<string>("type");

        return (
          <div className="flex items-center">
            {/* Conditionally render the appropriate icon based on the type */}
            {type === "Master" ? (
              <GraduationCap className="mr-2 text-blue-600" />
            ) : type === "Ph.D" ? (
              <User className="mr-2 text-green-600" />
            ) : type === "Post-Doc" ? (
              <FlaskConical className="mr-2 text-orange-600" /> // New Post-doc icon
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
              <DropdownMenuItem onClick={() => setTypeFilter(undefined)}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("Master")}>Master</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("Ph.D")}>Ph.D</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("Post-Doc")}>Post-Doc</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("type")}</div>,
    },
    {
      accessorKey: "startDate",
      header: "Started",
      cell: ({ row }) => <div>{row.getValue("startDate")}</div>,
    },
    {
      accessorKey: "defended",
      header: "Defended",
      cell: ({ row }) => {
        return (
          <div>
            {row.getValue("defended") ? new Date(row.getValue("defended")).toLocaleDateString() : ""}
          </div>
        );
      },
    },
    {
      accessorKey: "funding",
      header: "Funding",
      cell: ({ row }) => <div>{row.getValue("funding")}</div>,
    },
    // New subject column
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => <div>{row.getValue("subject")}</div>,
    },
    // New keywords column with styling
    {
      accessorKey: "keywords",
      header: "Keywords",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row
            .getValue<string[]>("keywords") // Type the keywords as an array of strings
            .map((keyword: string, index: number) => (
              <span
                key={index}
                className="bg-gray-300 dark:bg-gray-800 px-2 py-1 text-sm rounded border border-gray-300"
              >
                {keyword}
              </span>
            ))}
        </div>
      ),
    },
  ];

  const table = reactTable.useReactTable({
    data: filteredStudents,
    columns,
    state: { columnFilters: [] },
    getCoreRowModel: reactTable.getCoreRowModel(),
  });

  return (
    <div className="flex flex-col space-y-8">
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
                      : reactTable.flexRender(header.column.columnDef.header, header.getContext())}
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
                      {reactTable.flexRender(cell.column.columnDef.cell, cell.getContext())}
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

