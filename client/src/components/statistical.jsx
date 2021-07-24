import React from "react";

import { Bar } from "react-chartjs-2";
import { Card } from "react-bootstrap";

import SearchBox from "../components/common/searchBox";
import Pagination from "../components/common/pagination";
import { paginate } from "../utils/paginate";

import _ from "lodash";
import StatisticalTable from "./statisticalTable";

const Statistical = ({ myClass }) => {
  const [listLesson, setLessons] = React.useState([]);
  const [listNumOfAttendance, setListNumOfAttendance] = React.useState([]);
  const [listNumOfNonAttendance, setListNumNonOfAttendance] = React.useState(
    []
  );

  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(3);

  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const listLesson = myClass.lessons.map((x) => x.name);
    const listNumOfAttendance = myClass.lessons.map((x) => x.numOfAttendance);
    const listNumOfNonAttendance = myClass.lessons.map(
      (x) => x.numOfNonAttendance
    );

    setLessons(listLesson);
    setListNumOfAttendance(listNumOfAttendance);
    setListNumNonOfAttendance(listNumOfNonAttendance);

    setLoading(false);
  }, [myClass]);

  const data = {
    labels: [...listLesson],
    datasets: [
      {
        label: "Attended",
        data: [...listNumOfAttendance],
        backgroundColor: "rgb(54, 162, 235)",
      },
      {
        label: "Non Attended",
        data: [...listNumOfNonAttendance],
        backgroundColor: "rgb(255, 99, 132)",
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    plugins: {
      title: {
        display: true,
        text: "Summary of students' Attended and Non-Attended of each Lessons",
      },
    },
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const getPagedData = () => {
    let filtered = myClass.lessons;
    // if (searchQuery) {
    //   filtered = myClass.lessons.filter((x) =>
    //     x..toLowerCase().startsWith(searchQuery.toLowerCase())
    //   );
    // }
    const newLesson = paginate(filtered[0].students, currentPage, pageSize);

    return { totalCount: filtered[0].students.length, data: newLesson };
  };

  const { totalCount, data: newLesson } = getPagedData();

  return (
    <React.Fragment>
      <h4 className="title"></h4>
      <Bar data={data} options={options} width={100} height={10} />

      <Card className="striped-tabled-with-hover">
        <Card.Body className="table-full-width table-responsive px-auto py-auto">
          {/* <SearchBox value={searchQuery} onChange={handleSearch} /> */}
          {/* <LoadingPage isLoading={isLoading}> */}
          {totalCount === 0 ? (
            <p>Data empty</p>
          ) : (
            <StatisticalTable lessons={myClass.lessons} />
          )}
          {/* </LoadingPage> */}
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

export default Statistical;
