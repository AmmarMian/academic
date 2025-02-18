"use client";

import React, { useEffect, useState } from "react";
import * as reactTable from "@tanstack/react-table";
import { ArrowUpDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import CountUp from "react-countup";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge"; // New import for Badge

// Updated data model with bibtex field.
interface HalPublication {
  title: string;
  year: number;
  type: string;
  url: string;
  authors: string[];
  journalTitle?: string;
  conferenceTitle?: string;
  label_bibtex?: string;
  citationFull?: string;
}

// Helper function to format a publication in APA style.
function formatCitation(pub: HalPublication): string {
  let authors = "";
  if (pub.authors.length === 1) {
    authors = pub.authors[0];
  } else if (pub.authors.length > 1) {
    const last = pub.authors[pub.authors.length - 1];
    authors = pub.authors.slice(0, -1).join(", ") + ", & " + last;
  }
  const source = pub.journalTitle
    ? pub.journalTitle
    : pub.conferenceTitle
    ? pub.conferenceTitle
    : `Retrieved from ${pub.url}`;
    
  return `${authors} (${pub.year}). ${pub.title}. ${source}.`;
}

function cleanHALFullCitation(input: string) {
  let match = input.match(/<a [^>]*href=["']([^"']+)["'][^>]*>.*?<\/a>/i);
  let firstLink = match ? match[1] : ""; // Extract first link
  
  let cleaned = input.replace(/<i>(.*?)<\/i>/gi, '$1'); // Remove <i> tags
  cleaned = cleaned.replace(/<a [^>]*href=["'][^"']+["'][^>]*>.*?<\/a>/gi, ''); // Remove all <a> tags
  cleaned = cleaned.replace(/\s+/g, ' ').trim(); // Normalize spaces
  cleaned = cleaned.replace(/\.*\s*$/, ''); // Remove trailing dots and spaces

  return cleaned + (firstLink ? " " + firstLink : "");
}
const HalPublicationsTable: React.FC = () => {
  const [publications, setPublications] = useState<HalPublication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sorting and filtering state
  const [sorting, setSorting] = useState<reactTable.SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<reactTable.ColumnFiltersState>([]);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch("/api/publications.json");
        const data = await response.json();

        const formattedPublications: HalPublication[] = data.response.docs.map(
          (doc: any) => ({
            title: doc.title_s
              ? Array.isArray(doc.title_s)
                ? doc.title_s[0]
                : doc.title_s
              : "Untitled",
            year: doc.producedDate_s
              ? parseInt(doc.producedDate_s.substring(0, 4))
              : 0,
            type: doc.docType_s || "Other",
            url: doc.uri_s ?? "#",
            authors: doc.authFullName_s ?? [],
            journalTitle: doc.journalTitle_s,
            conferenceTitle: doc.conferenceTitle_s,
            label_bibtex: doc.label_bibtex || "",
            citationFull: doc.citationFull_s || "",
          })
        );

        setPublications(formattedPublications);
      } catch (err) {
        setError("Failed to fetch publications");
      } finally {
        setLoading(false);
      }
    };
    fetchPublications();
  }, []);

  const columns: reactTable.ColumnDef<HalPublication>[] = [
    {
      accessorKey: "year",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() =>
            setSorting((old) => {
              const current = old.find((s) => s.id === "year");
              return current?.desc === false
                ? [{ id: "year", desc: true }]
                : [{ id: "year", desc: false }];
            })
          }
        >
          Year <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("year")}</div>,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() =>
            setSorting((old) => {
              const current = old.find((s) => s.id === "title");
              return current?.desc === false
                ? [{ id: "title", desc: true }]
                : [{ id: "title", desc: false }];
            })
          }
        >
          Title <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <a
          href={row.original.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          <FileText className="inline-block mr-2" /> {row.getValue("title")}
        </a>
      ),
      filterFn: "includesString",
    },
    {
      id: "conference_or_journal",
      accessorFn: (row) => row.conferenceTitle || row.journalTitle || "N/A",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() =>
            setSorting((old) => {
              const current = old.find((s) => s.id === "conference_or_journal");
              return current?.desc === false
                ? [{ id: "conference_or_journal", desc: true }]
                : [{ id: "conference_or_journal", desc: false }];
            })
          }
        >
          Conference/Journal <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => {
        const pub = row.original;
        const displayValue = pub.conferenceTitle || pub.journalTitle || "N/A";
        return <span>in {displayValue}</span>;
      },
    },
    {
      // Use accessorFn to join authors for filtering while rendering badges in the cell.
      id: "authors",
      accessorFn: (row) => row.authors.join(" "),
      header: "Authors",
      cell: ({ row }) => {
        const authors: string[] = row.original.authors;
        return (
          <div className="flex flex-wrap gap-2">
            {authors.map((author, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={author === "Ammar Mian" ? "font-bold" : ""}
              >
                {author}
              </Badge>
            ))}
          </div>
        );
      },
      filterFn: "includesString",
    },
    {
      accessorFn: (row) =>
        row.type === "ART"
          ? "Journal"
          : row.type === "COMM"
          ? "Conference"
          : "Other",
      id: "type",
      header: "Type",
      cell: ({ row }) => <div>{row.getValue("type")}</div>,
    },
    {
      id: "cite",
      header: "Cite",
      cell: ({ row }) => {
        const pub = row.original;
        const citationFull = pub.citationFull || "";
        const citation = citationFull === "" ? formatCitation(pub) : cleanHALFullCitation(citationFull);
        const bibtex = pub.label_bibtex || "BibTeX not available.";

        const copyBibtex = async () => {
          try {
            await navigator.clipboard.writeText(bibtex);
            alert("BibTeX copied to clipboard!");
          } catch (err) {
            alert("Failed to copy BibTeX.");
          }
        };

        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Cite this</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Citation</DialogTitle>
                <DialogDescription className="max-w-[400px] overflow-auto">{citation}</DialogDescription>
              </DialogHeader>
              <div className="my-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  BibTeX
                </label>
                <Textarea
                  readOnly
                  value={bibtex}
                  className="w-full min-h-[150px] resize-none p-2 border rounded-md"
                />
              </div>
              <DialogFooter>
                <Button onClick={copyBibtex}>Copy BibTeX</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      },
    },
  ];

  const table = reactTable.useReactTable({
    data: publications,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: reactTable.getCoreRowModel(),
    getPaginationRowModel: reactTable.getPaginationRowModel(),
    getSortedRowModel: reactTable.getSortedRowModel(),
    getFilteredRowModel: reactTable.getFilteredRowModel(),
  });

  if (loading) return <div className="text-center text-xl">Loading...</div>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const titleFilter = (table.getColumn("title")?.getFilterValue() as string) ?? "";
  const authorsFilter = (table.getColumn("authors")?.getFilterValue() as string) ?? "";
  const typeFilter = (table.getColumn("type")?.getFilterValue() as string) ?? "";

  return (
    <div className="flex flex-col space-y-8">
      {/* Count Cards */}
      <div className="justify-center flex gap-7 mt-5">
        <Card className="w-20 min-w-[200px] p-4">
          <CardTitle>Journals</CardTitle>
          <CardContent className="text-center text-4xl font-bold mt-3">
            <CountUp end={publications.filter((pub) => pub.type === "ART").length} />
          </CardContent>
        </Card>
        <Card className="w-20 min-w-[200px] p-4">
          <CardTitle>Conferences</CardTitle>
          <CardContent className="text-center text-4xl font-bold mt-3">
            <CountUp end={publications.filter((pub) => pub.type === "COMM").length} />
          </CardContent>
        </Card>
      </div>

      {/* Search Inputs and Type Filter */}
      <div className="justify-center flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search Title..."
          value={titleFilter}
          onChange={(e) =>
            table.getColumn("title")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <Input
          placeholder="Search Authors..."
          value={authorsFilter}
          onChange={(e) =>
            table.getColumn("authors")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {typeFilter ? typeFilter : "Filter by Type"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => table.getColumn("type")?.setFilterValue(undefined)}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => table.getColumn("type")?.setFilterValue("Journal")}>
              Journal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => table.getColumn("type")?.setFilterValue("Conference")}>
              Conference
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => table.getColumn("type")?.setFilterValue("Other")}>
              Other
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

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          variant="outline"
        >
          Previous
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default HalPublicationsTable;

