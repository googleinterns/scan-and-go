import React, { useEffect, useState } from "react";

function AlertBoxQueued({ content }: { content: React.ReactElement[] }) {
  const [displayedAlert, setDisplayedAlert] = useState<
    React.ReactElement | undefined
  >();
  const [alertQueue, setAlertQueue] = useState<React.ReactElement[]>([]);
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
    if (alertQueue.length) {
      console.log(`addition: ${alertQueue.length}`);
      setQueue([...alertQueue, ...queue]);
      setAlertQueue([]);
    }
  }, [alertQueue]);

  useEffect(() => {
    if (content) {
      setAlertQueue(content);
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
