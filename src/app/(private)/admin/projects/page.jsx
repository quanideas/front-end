import AdminLayout from "@/components/layout/adminLayout/AdminLayout";
import CompanyProjects from "@/components/pages/user/share/companyProjects/CompanyProjects";



import React from "react";

const CompanyUserPage = () => {

  return (
    <AdminLayout>
        <CompanyProjects isRoot = {false}/>
    </AdminLayout>
  );
};

export default CompanyUserPage;