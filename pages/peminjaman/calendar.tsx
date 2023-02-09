import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import PageBody from "../../components/layout/PageBody";
import PageTitle from "../../components/layout/PageTitle";
import { ChangeEvent, useEffect, useState } from "react";
import { getAllPeminjaman } from "../../firebase/peminjaman";
import SelectTempat from "../../components/forms/SelectTempat";

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
    if (data.length > 0 && tempat) {
      // Set event where data.peminjaman.jenis_pinjaman === tempat
      setEvents(
        data
          .filter((item: any) => {
            return item.peminjaman.jenis_pinjaman === tempat;
          })
          .map((item: any) => {
            return {
              title: item.peminjaman.pemohon.name,
              start: item.peminjaman.waktu_pinjam.toDate(),
              end: item.peminjaman.waktu_kembali.toDate(),
              url: `/peminjaman/${item.id}`,
            };
          })
      );
    }
  }, [data, tempat]);

  const handleSelect = (e: any) => {
    console.log(e.startStr);
    console.log(e.endStr);
    // console.log(e);
  };

  // const handleDateClick = (e: any) => {
  //   console.log(e.dateStr);
  // };

  return (
    <>
      <PageTitle>Kalender Peminjaman</PageTitle>
      <PageBody>
        <div className="mt-5">
          <div className="absolute -top-2">
            <SelectTempat
              label={"Pilih Tempat"}
              error={""}
              id={"select-tempat"}
              value={tempat}
              onChange={(e) => setTempat(e.target.value)}
              style={"light"}
              hideLabel
            />
          </div>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "",
              center: "title",
              right: "prev,next today dayGridMonth,timeGridWeek,timeGridDay",
            }}
            weekends={false}
            events={events}
            eventContent={renderEventContent}
            // dateClick={handleDateClick}
            selectable={true}
            select={handleSelect}
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
      <span> | {eventInfo.event.title}</span>
    </>
  );
}
