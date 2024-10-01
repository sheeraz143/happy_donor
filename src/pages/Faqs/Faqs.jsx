// import React, { useState } from 'react';
import { useEffect, useState } from "react";
import search from "../../assets/search.png";

export default function Faqs() {
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    {
      title: "1. Introduction",
      content: "Overview of the app's commitment to protecting user privacy.",
    },
    {
      title: "2. Information Collection",
      content: "Details on what personal data is collected and how it is used.",
    },
    {
      title: "3. Data Usage",
      content:
        "Explanation of how collected data is used to enhance the user experience.",
    },
    {
      title: "4. Data Sharing",
      content: "Information on who data is shared with and why.",
    },
    {
      title: "5. User Rights",
      content:
        "Explanation of user rights regarding their data (access, correction, etc.).",
    },
    {
      title: "6. Security Measures",
      content: "Overview of how data is protected against unauthorized access.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="my-4">
      <h5 className="mb-3">FAQs</h5>

      {/* Privacy Policy Sections in a Single Column */}
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="switch-container mb-3 d-flex align-items-center">
            <input
              placeholder="Search FAQs..."
              className="form-control"
              style={{ border: "none", outline: "none" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <img src={search} alt="search" className="mx-2" />
          </div>

          {filteredFaqs.map((faq, index) => (
            <div key={index}>
              <h5 className="card-title text-start">{faq.title}</h5>
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <p className="card-text">{faq.content}</p>
                </div>
              </div>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <p className="text-center">No FAQs found matching your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}
