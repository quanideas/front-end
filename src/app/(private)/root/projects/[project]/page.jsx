import RootLayout from "@/components/layout/rootLayout/RootLayout";
import CompanyProjects from "@/components/pages/user/share/companyProjects/CompanyProjects";



import React from "react";

const CompanyUserPage = () => {

  return (
    <RootLayout>
        <CompanyProjects backRoute = "/root/projects"/>
    </RootLayout>
  );
};

export default CompanyUserPage;