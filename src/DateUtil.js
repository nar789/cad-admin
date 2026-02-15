import dayjs from "dayjs";

export default function DateUtil() {
  return {
    displayDatetime: (datetime) => {
      const d = dayjs(datetime * 1000);
      d.locale("ko");
      return d.format("YYYY-MM-DD HH:mm:ss");
    },
  };
}
