import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import PageBody from "../../components/layout/PageBody";
import PageTitle from "../../components/layout/PageTitle";
import { ChangeEvent, useEffect, useState } from "react";
import { getAllPeminjaman, IPeminjamanData } from "../../firebase/peminjaman";
import SelectTempat from "../../components/forms/SelectTempat";
import Head from "next/head";

// end date is now + 1 hour
const endDate = new Date();
endDate.setHours(endDate.getHours() + 1);

export default function Kalendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [data, setData] = useState<IPeminjamanData[]>([]);
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
            if (item.peminjaman.paraf_SM === false) {
              // Diproses
              return {
                title: item.peminjaman.pemohon.name,
                start: item.peminjaman.waktu_pinjam.toDate(),
                end: item.peminjaman.waktu_kembali.toDate(),
                url: `/peminjaman/detail/${item.id}`,
                backgroundColor: "#10316B",
                borderColor: "#10316B",
              };
            } else {
              // Selesai
              return {
                title: item.peminjaman.pemohon.name,
                start: item.peminjaman.waktu_pinjam.toDate(),
                end: item.peminjaman.waktu_kembali.toDate(),
                url: `/peminjaman/detail/${item.id}`,
                backgroundColor: "#00BD56",
                borderColor: "#00BD56",
              };
            }
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
      <Head>
        <title>Kalendar Peminjaman</title>
      </Head>
      <PageTitle>Kalendar Peminjaman</PageTitle>
      <PageBody>
        <div className="flex flex-col">
          <p className="font-semibold">Keterangan</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500"></div>
            <p>Sudah disetujui</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-900"></div>
            <p>Diproses</p>
          </div>
        </div>
        <div className="mt-5 ">
          <div className="w-1/4 absolute -translate-y-1">
            <SelectTempat
              label={"Pilih Tempat"}
              error={""}
              id={"select-tempat"}
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
            weekends={true}
            events={events}
            eventContent={renderEventContent}
            // dateClick={handleDateClick}
            selectable={true}
            select={handleSelect}
            eventDisplay={"block"}
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
        {(eventInfo.event.start.getHours() >= 10
          ? eventInfo.event.start.getHours()
          : "0" + eventInfo.event.start.getHours()) +
          ":" +
          (eventInfo.event.start.getMinutes() >= 10
            ? eventInfo.event.start.getMinutes()
            : "0" + eventInfo.event.start.getMinutes()) +
          " - " +
          (eventInfo.event.end.getHours() >= 10
            ? eventInfo.event.end.getHours()
            : "0" + eventInfo.event.end.getHours()) +
          ":" +
          (eventInfo.event.end.getMinutes() >= 10
            ? eventInfo.event.end.getMinutes()
            : "0" + eventInfo.event.end.getMinutes())}
      </b>
      <span> | {eventInfo.event.title}</span>
    </>
  );
}
