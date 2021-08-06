import React from "react";

import { Bar } from "react-chartjs-2";
import { Card } from "react-bootstrap";

import { paginate } from "../utils/paginate";

import StatisticalTable from "./statisticalTable";

const Statistical = ({ myClass }) => {
  const [listLesson, setLessons] = React.useState([]);
  const [listNumOfAttendance, setListNumOfAttendance] = React.useState([]);
  const [listNumOfNonAttendance, setListNumNonOfAttendance] = React.useState(
    []
  );

  React.useEffect(() => {
    const listLesson = myClass.lessons.map((x) => x.name);
    const listNumOfAttendance = myClass.lessons.map((x) => x.numOfAttendance);
    const listNumOfNonAttendance = myClass.lessons.map(
      (x) => x.numOfNonAttendance
    );

    setLessons(listLesson);
    setListNumOfAttendance(listNumOfAttendance);
    setListNumNonOfAttendance(listNumOfNonAttendance);
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

  const getPagedData = () => {
    let filtered = myClass?.lessons;
    // if (searchQuery) {
    //   filtered = myClass.lessons.filter((x) =>
    //     x..toLowerCase().startsWith(searchQuery.toLowerCase())
    //   );
    // }
    const newLesson = paginate(filtered[0]?.students, 1, 1);

    return { totalCount: filtered[0].students.length, data: newLesson };
  };

  const { totalCount, data: newLesson } = getPagedData();

  return (
    <React.Fragment>
      <h4 className="title"></h4>
      <Bar data={data} options={options} width={100} height={10} />

      <Card className="striped-tabled-with-hover">
        <Card.Body className="table-full-width table-responsive px-auto py-auto">
          {totalCount === 0 ? (
            <p>Data empty</p>
          ) : (
            <StatisticalTable lessons={myClass.lessons} />
          )}
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

export default Statistical;
