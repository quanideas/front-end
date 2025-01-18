
import RootLayout from "@/components/layout/rootLayout/RootLayout";
import CompanyProjects from "@/components/pages/user/share/companyProjects/CompanyProjects";

import React from "react";

const CompanyProjectsPage = () => {

  return (
    <RootLayout>
      <CompanyProjects backRoute = "/root/companies"/>
    </RootLayout>
  );
};

export default CompanyProjectsPage;