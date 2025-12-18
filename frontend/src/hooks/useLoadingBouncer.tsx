import { useEffect, useState } from "react";

function useLoadingBouncer(isLoading: boolean, delay = 1000) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (!isLoading) {
      timer = setTimeout(() => {
        setShow(true);
      }, delay);
    } else {
      setShow(false);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading, delay]);

  return show;
}

export default useLoadingBouncer;
