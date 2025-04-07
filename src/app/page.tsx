"use client";

import { useCallback, useEffect, useState } from "react";

interface Advocate {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
}

export default function Home() {
  // Need to type the states for better type safety
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchAdvocates = useCallback(async () => {
    const response = await fetch("/api/advocates");
    const jsonResponse = await response.json();
    setAdvocates(jsonResponse.data);
    setFilteredAdvocates(jsonResponse.data);
    console.log("fetching advocates...");
  }, []);

  useEffect(() => {
    fetchAdvocates()
  }, [fetchAdvocates]);
  

  // Don't think changing the DOM itself when searching is the best way to do it since we are using React
  useEffect(() => {
    const filteredAdvocates = advocates.filter((advocate) => {
      if (!isNaN(+searchTerm)) {
        // Dont think it would make sense to search for phone number so we filter on years of experience
        return advocate.yearsOfExperience >= +searchTerm;
      } else {
        return (
          advocate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          advocate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          advocate.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          advocate.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
          advocate.specialties.some((s) =>
            s.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
    });

    setFilteredAdvocates(filteredAdvocates);
  }, [searchTerm, advocates]);

  const onClick = useCallback(() => {
    setSearchTerm("");
  }, []);

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input style={{ border: "1px solid black" }} onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm}/>
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          {/* Fixed the Hydration error by adding the tr tag */}
          <tr style={{ border: "1px solid black", width: "100%" }}>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th style={{ width: "500px" }}>Specialties</th>
            <th>Years of Experience</th>
            <th style={{ width: "200px" }}>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate, index) => {
            return (
              <tr key={`${advocate.phoneNumber}-${index}`} style={{ marginTop: "10px", padding: "10px" }}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td style={{ width: "500px" }}>
                  {advocate.specialties.map((s, index) => (
                    <div key={`${s}-${index}`}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td style={{ width: "200px" }}>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
