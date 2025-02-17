import React, { useEffect, useState, type ReactNode } from "react";
import { BookOpen, FileText, Presentation, Book } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LoaderCircle } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import CountUp from 'react-countup';


// Define the structure of a publication
interface HalPublication {
  title: string;
  year: number;
  type: string;
  url: string;
  authors: string[];
  journalTitle?: string; // Added field for journal title
  conferenceTitle?: string; // Added field for conference title
}

const typeMapping: Record<string, { label: string; icon: ReactNode }> = {
  "ART": { label: "Journals", icon: <BookOpen size={24} /> },
  "COMM": { label: "Conferences", icon: <Presentation size={24} /> },
  "OTHER": { label: "Others", icon: <FileText size={24} /> },
};

const HalPublications: React.FC = () => {
  const [publications, setPublications] = useState<HalPublication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch("https://api.archives-ouvertes.fr/search/?q=ammar+mian&fl=uri_s,authFullName_s,title_s,docType_s,keyword_s,producedDate_s,journalTitle_s,conferenceTitle_s&sort=producedDate_s%20desc&wt=json");
        const data = await response.json();
        
        const formattedPublications: HalPublication[] = data.response.docs.map((doc: any) => ({
          title: Array.isArray(doc.title_s) ? doc.title_s[0] : doc.title_s ?? "Untitled", // Keep only the first part of the title
          year: doc.producedDate_s ? parseInt(doc.producedDate_s.substring(0, 4)) : 0,
          type: typeMapping[doc.docType_s]?.label || "Other",
          url: doc.uri_s ?? "#",
          authors: doc.authFullName_s ?? [],
          journalTitle: doc.journalTitle_s, // Added journalTitle field
          conferenceTitle: doc.conferenceTitle_s, // Added conferenceTitle field
        }));

        setPublications(formattedPublications);
      } catch (err) {
        setError("Failed to fetch publications");
      } finally {
        setLoading(false);
      }
    };
    fetchPublications();
  }, []);

  const groupedPublications = Object.entries(
    publications.reduce((acc, pub) => {
      if (!acc[pub.year]) acc[pub.year] = {};
      if (!acc[pub.year][pub.type]) acc[pub.year][pub.type] = [];
      acc[pub.year][pub.type].push(pub);
      return acc;
    }, {} as Record<number, Record<string, HalPublication[]>>)
  ).sort(([a], [b]) => Number(b) - Number(a)); // Sort years in descending order

  // Count the journals and conferences
  const journalCount = publications.filter((pub) => pub.type === "Journals").length;
  const conferenceCount = publications.filter((pub) => pub.type === "Conferences").length;

  if (loading) return (
        <div className="flex justify-center items-center mb-100">
        <LoaderCircle className="animate-spin w-10 h-10 text-blue-500" /> 
        <div className="text-xl ml-4">Loading...</div>
        </div>
  );
  
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col space-y-8 mb-5 mt-4">
      {/* Display the count of journals and conferences */}
          <div className="w-full flex gap-7">
            <Card className="w-20 min-w-[200px] p-4">
                <CardTitle>
                    <span className="flex items-center"><Book className="w-5 h-5 mr-1" /> Journals</span>
                </CardTitle>
                <CardContent className="flex w-full justify-center h-full items-center">
                    <span className="text-4xl font-bold justify-center">
                        <CountUp end = {journalCount} />
                    </span>
                </CardContent>
            </Card>
            <Card className="w-20 min-w-[200px] p-4">
                <CardTitle>
                    <span className="flex items-center"><Presentation className="w-5 h-5 mr-1" /> Conferences</span>
                </CardTitle>
                <CardContent className="flex w-full justify-center h-full items-center">
                    <span className="text-4xl font-bold justify-center">
                        <CountUp end = {conferenceCount} />
                    </span>
                </CardContent>
            </Card>
          </div>

        <div className="w-full max-w-4xl">

          {groupedPublications.length === 0 ? (
            <p>No publications found.</p>
          ) : (
            groupedPublications.map(([year, types]) => (
              <section key={year} className="space-y-6">
                <h2 className="text-2xl font-semibold border-b pb-2 max-w-xl mt-5">{year}</h2>
                {Object.entries(types).map(([type, pubs]) => (
                  <div key={type} className="space-y-4">
                    <h3 className="text-xl font-medium">{type}</h3>
                    <ul className="space-y-4">
                      {pubs.map((pub, index) => (
                        <li key={index} className="flex items-center space-x-4">
                          {/* <a href={pub.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700"> */}
                          {/*   {typeMapping[pub.type]?.icon || <FileText size={30} />} */}
                          {/* </a> */}
                          <div className="space-y-1">
                            <p className="font-bold text-lg"><FileText className="inline-block" /> {pub.title}</p>
                            <p className="">
                              {pub.authors.map((author, i) => (
                                <span key={i} className={author === "Ammar Mian" ? "font-bold" : ""}>
                                  {author}
                                  {i < pub.authors.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </p>
                            {/* Show either journalTitle or conferenceTitle based on type */}
                            {pub.type === "Journals" && pub.journalTitle && (
                              <p className="text-gray-500">{pub.journalTitle}</p>
                            )}
                            {pub.type === "Conferences" && pub.conferenceTitle && (
                              <p className="text-gray-500">{pub.conferenceTitle}</p>
                            )}
                            <p><a href={pub.url} className="text-sm">Go to publication</a></p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            ))
          )}
        </div>
    </div>
  );
};

export default HalPublications;

