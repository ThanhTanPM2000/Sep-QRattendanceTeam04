import React, { useEffect, useState } from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import Pagination from "../components/common/pagination";
import ListGroup from "../components/common/listGroup";
import SearchBox from "../components/common/searchBox";
import SemesterTable from "../components/semesterTable";
import LoadingPage from "../components/loadingPage";
import { paginate } from "../utils/paginate";
import { getSemesters } from "../services/semesterService";
import { deleteSemester } from "../services/semesterService";

const Semesters = () => {
  const [semestersList, setSemesters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState({
    path: "name",
    order: "asc",
  });

  useEffect(() => {
    async function getDataFromApi() {
      try {
        let { data: newSemesters } = await getSemesters();

        setSemesters(newSemesters);
      } catch (error) {}
    }

    getDataFromApi();
  }, []);

  const handleDelete = async (semester) => {
    const originalSemester = [...semestersList];

    const newSemesters = originalSemester.filter((m) => m._id !== semester._id);
    setSemesters(newSemesters);

    try {
      await deleteSemester(semester);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("This semester has already been deleted");
      } else if (error.response && error.response.status === 403) {
        toast.error("Access denied");
      }
      setSemesters(originalSemester);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = async (sortColumn) => {
    await setSortColumn(sortColumn);
  };

  const handleSearch = async (query) => {
    await setSearchQuery(query);
    await setCurrentPage(1);
  };

  const getPagedData = () => {
    let filtered = semestersList;
    if (searchQuery) {
      filtered = semestersList.filter((x) =>
        x.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const semesters = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: semesters };
  };

  const { totalCount, data: newSemesters } = getPagedData();

  return (
    <LoadingPage>
      <div className="row">
        <div className="auth-wrapper auth-inner col-md" style={{ padding: 20 }}>
          <div className="row">
            <div className="col-md">
              <p>
                Showing{" "}
                <span className="badge badge-primary">{totalCount}</span> semesters
                in the database
              </p>
            </div>
            <div className="col-md-3">
              <Link
                to="/semesters/new"
                className="btn btn-primary"
                style={{ marginBottom: 20, width: 150 }}
              >
                Create Semester
              </Link>
            </div>
          </div>
          <SearchBox value={searchQuery} onChange={handleSearch} />
          <SemesterTable
            semesters={newSemesters}
            sortColumn={sortColumn}
            onDelete={handleDelete}
            onSort={handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </LoadingPage>
  );
};

export default Semesters;
