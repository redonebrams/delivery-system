import React from "react";

const OrderTimeline = ({ timeline }) => (
  <ul className="timeline">
    {timeline.map((event, index) => (
      <li key={index}>
        <span>{new Date(event.date).toLocaleString()}</span> - {event.status}
      </li>
    ))}
  </ul>
);

export default OrderTimeline;
