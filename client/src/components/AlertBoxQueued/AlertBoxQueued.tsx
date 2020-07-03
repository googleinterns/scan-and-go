import React, { useEffect, useState } from "react";

function AlertBoxQueued({ content }: { content: React.ReactElement[] }) {
  const [displayedAlert, setDisplayedAlert] = useState<
    React.ReactElement | undefined
  >();
  const [queue, setQueue] = useState<React.ReactElement[]>([]);

  const popContent = () => {
    queue.pop();
    setQueue([...queue]);
  };

  useEffect(() => {
    if (queue.length) {
      setDisplayedAlert(queue[queue.length - 1]);
    } else {
      setDisplayedAlert(undefined);
    }
  }, [queue]);

  useEffect(() => {
    if (content) {
      setQueue([...content, ...queue]);
    }
  }, [content]);

  return (
    <div
      className="AlertBoxQueued"
      style={{
        bottom: "0px",
        position: "absolute",
        width: "100%",
        left: "0px",
      }}
    >
      {displayedAlert &&
        React.cloneElement(displayedAlert, {
          closeCallback: popContent,
        })}
    </div>
  );
}

export default AlertBoxQueued;
