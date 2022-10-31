import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';

function Leaderboard({users, rows, ...props}) {
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationItems, setPaginationItems] = useState([]);

  const generateDisplayedUsers = (activePage) => {
    const start = rows * (activePage - 1);
    const end = rows + start;

    const usersCopy = users.slice();
    const sorted = usersCopy.sort((a, b) => b.score - a.score);
    const usersToDisplay = sorted.slice(start, end);

    setDisplayedUsers(usersToDisplay);
  };

  const updateTablePage = (e) => {
    // Ensure we get the index we are interested in
    const targetIndex = parseInt(e.target.innerHTML[0]);
    setCurrentPage(targetIndex);

    generateDisplayedUsers(targetIndex);
    generatePaginationItems(targetIndex);
  };

  const generatePaginationItems = (activePage) => {
    const items = [];
    const pagesNeeded = Math.ceil(users.length / rows);

    for (let i = 1; i <= pagesNeeded; i++) {
      // Danny: we could just pass in i instead of event
      items.push(
        <Pagination.Item key={i} active={i === activePage} onClick={(event) =>
          updateTablePage(event)}>
          {i}
        </Pagination.Item>
      );
    };

    setPaginationItems(items);
  };

  useEffect(() => {
    const defaultActivePage = 1;
    generateDisplayedUsers(defaultActivePage);

    if (users.length / rows > 1) {
      generatePaginationItems(defaultActivePage);
    }
  }, [users]);

  const renderUsers = () => {
    const offset = rows * (currentPage - 1);
    return displayedUsers.map((user, index) =>
      <tr key={user.id}>
        <td>{offset + index + 1}</td>
        <td>
          <Link to={{ pathname: "user/", user: user}}>{user.name}</Link>
        </td>
        <td>{user.score}</td>
      </tr>
    );
  };
  
  return (
    <>
      <h2>Leaderboard</h2>
      <p>See how you compare to your colleagues</p>
      
      <Table bordered hover striped>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          { renderUsers() }
        </tbody>
      </Table>

      <Pagination size="lg">{paginationItems}</Pagination>
    </>
  );
};

export default Leaderboard;
