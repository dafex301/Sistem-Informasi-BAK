import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import PageBody from "../../components/layout/PageBody";
import PageTitle from "../../components/layout/PageTitle";
import { useEffect, useState } from "react";
import { getAllPeminjaman } from "../../firebase/peminjaman";

// end date is now + 1 hour
const endDate = new Date();
endDate.setHours(endDate.getHours() + 1);

export default function Calendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [data, setData] = useState([]);
  const [tempat, setTempat] = useState<string>("");
  useEffect(() => {
    if (data.length === 0) {
      (async () => {
        setData(await getAllPeminjaman());
      })();
    }
  });

  //   If there is data, then map the data to events
  useEffect(() => {
    if (data.length > 0) {
      setEvents(
        data.map((item: any) => {
          return {
            title: item.peminjaman.pemohon.name,
            start: item.peminjaman.waktu_pinjam.toDate(),
            end: item.peminjaman.waktu_kembali.toDate(),
          };
        })
      );
    }
  }, [data]);

  const handleDateClick = (e: any) => {
    console.log(e.dateStr);
  };
  return (
    <>
      <PageTitle>Kalender Peminjaman</PageTitle>
      <PageBody>
        <div>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            weekends={false}
            events={events}
            eventContent={renderEventContent}
            dateClick={handleDateClick}
          />
        </div>
      </PageBody>
    </>
  );
}

// a custom render function
function renderEventContent(eventInfo: any) {
  return (
    <>
      {/* <b>{eventInfo.event.start.toLocaleTimeString("id-ID")}</b> */}
      {/* Only get hour and minute */}
      <b>
        {(eventInfo.event.start.getHours() > 10
          ? eventInfo.event.start.getHours()
          : "0" + eventInfo.event.start.getHours()) +
          ":" +
          (eventInfo.event.start.getMinutes() > 10
            ? eventInfo.event.start.getMinutes()
            : "0" + eventInfo.event.start.getMinutes()) +
          " - " +
          (eventInfo.event.end.getHours() > 10
            ? eventInfo.event.end.getHours()
            : "0" + eventInfo.event.end.getHours()) +
          ":" +
          (eventInfo.event.end.getMinutes() > 10
            ? eventInfo.event.end.getMinutes()
            : "0" + eventInfo.event.end.getMinutes())}
      </b>
      <i> | {eventInfo.event.title}</i>
    </>
  );
}
