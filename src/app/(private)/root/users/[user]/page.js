
import RootLayout from "@/components/layout/rootLayout/RootLayout";
import CompanyUsers from "@/components/pages/user/share/companyUsers/CompanyUsers";



import React from "react";

const CompanyUserPage = () => {

  return (
    <RootLayout>
        <CompanyUsers backRoute = "/root/users"/>
    </RootLayout>
  );
};

export default CompanyUserPage;