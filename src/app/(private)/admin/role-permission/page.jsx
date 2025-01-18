import AdminLayout from "@/components/layout/adminLayout/AdminLayout";
import CompanyRoles from "@/components/pages/user/share/companyRoles/CompanyRoles";



import React from "react";

const CompanyUserPage = () => {

  return (
    <AdminLayout>
        <CompanyRoles/>
    </AdminLayout>
  );
};

export default CompanyUserPage;