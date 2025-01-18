import AdminLayout from "@/components/layout/adminLayout/AdminLayout";
import CompanyUsers from "@/components/pages/user/share/companyUsers/CompanyUsers";



import React from "react";

const CompanyUserPage = () => {

  return (
    <AdminLayout>
        <CompanyUsers/>
    </AdminLayout>
  );
};

export default CompanyUserPage;