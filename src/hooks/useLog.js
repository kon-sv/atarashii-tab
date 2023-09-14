function useLog() {
  const [log, setLog] = useState([]);

  const addLog = (newLog) => {
    setLog((prevLog) => [...prevLog, newLog]);
  };

  return { log, addLog };
}
