import { useEffect, useState } from "react";
import { createTables } from "../database/schema";
import { seedDatabase } from "../database/seed";

export const useDatabase = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await createTables();
      await seedDatabase();
      setReady(true);
    };

    init();
  }, []);

  return ready;
};
