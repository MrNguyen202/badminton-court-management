"use client"

import { useEffect, useState } from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal"
import courtImage from "../../../../public/football-field.gif"
import { subCourtApi } from "@/app/api/court-services/subCourtAPI"
import { subCourtScheduleApi } from "@/app/api/court-services/subCourtSchedule"
import { TimeInput } from "@heroui/react"
import { Time, CalendarDate } from "@internationalized/date"
import soonImage from "../../../../public/sun-03-stroke-rounded.svg"
import moonImage from "../../../../public/moon-02-stroke-rounded.svg"
import { Input } from "@nextui-org/input"
import { Checkbox, CheckboxGroup, Radio, RadioGroup, DatePicker } from "@nextui-org/react"

interface AddScheduleSmartProps {
  courtID: number
  onScheduleAdded: () => void
}

type SubCourt = {
  id: number
  subName: string
  type: string
}

function AddScheduleSmart({ courtID, onScheduleAdded }: AddScheduleSmartProps) {
  const [subCourts, setSubCourts] = useState<SubCourt[]>([])
  const [courtId, setCourtId] = useState(courtID)

  useEffect(() => {
    const fetchSubCourts = async () => {
      try {
        const response = await subCourtApi.getAllSubCourt(courtId)
        setSubCourts(response)
      } catch (error) {
        console.log(error)
      }
    }
    fetchSubCourts()
  }, [courtId])

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const [selectedCourts, setSelectedCourts] = useState<string[]>(["all"])
  const [morningInterval, setMorningInterval] = useState<"owntime" | "part-own" | "twotime">("owntime")
  const [morningStartTime, setMorningStartTime] = useState<Time | null>(new Time(4, 0))
  const [morningEndTime, setMorningEndTime] = useState<Time | null>(new Time(12, 0))
  const [eveningInterval, setEveningInterval] = useState<"owntime" | "part-own" | "twotime">("owntime")
  const [eveningStartTime, setEveningStartTime] = useState<Time | null>(new Time(13, 0))
  const [eveningEndTime, setEveningEndTime] = useState<Time | null>(new Time(22, 0))
  const [duration, setDuration] = useState<"day" | "week" | "month" | "year">("day")
  const [price, setPrice] = useState<string>("100")
  const [selectedDate, setSelectedDate] = useState<CalendarDate>(
    new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()),
  )

  const allCourtValues = subCourts.map((subCourt) => `subcourt-${subCourt.id}`)

  const handleCourtSelectionChange = (newSelectedCourts: string[]) => {
    const selectedWithoutAll = newSelectedCourts.filter((court) => court !== "all")
    const allCourtsSelected = allCourtValues.every((court) => newSelectedCourts.includes(court))

    if (newSelectedCourts.includes("all")) {
      if (!selectedCourts.includes("all")) {
        setSelectedCourts([...allCourtValues, "all"])
      } else {
        setSelectedCourts(selectedWithoutAll)
      }
    } else {
      if (selectedCourts.includes("all")) {
        setSelectedCourts([])
      } else {
        if (allCourtsSelected) {
          setSelectedCourts([...selectedWithoutAll, "all"])
        } else {
          setSelectedCourts(selectedWithoutAll)
        }
      }
    }
  }

  const generateSchedules = (
    startTime: Time | null,
    endTime: Time | null,
    interval: "owntime" | "part-own" | "twotime",
  ) => {
    if (!startTime || !endTime) return []

    const schedules: { fromHour: string; toHour: string }[] = []
    let currentHour = startTime.hour
    let currentMinute = startTime.minute

    const intervalMinutes = interval === "owntime" ? 60 : interval === "part-own" ? 90 : 120

    while (currentHour < endTime.hour || (currentHour === endTime.hour && currentMinute < endTime.minute)) {
      const fromHour = `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`

      const nextHour = currentHour + Math.floor((currentMinute + intervalMinutes) / 60)
      const nextMinute = (currentMinute + intervalMinutes) % 60
      if (nextHour > endTime.hour || (nextHour === endTime.hour && nextMinute > endTime.minute)) break

      const toHour = `${nextHour.toString().padStart(2, "0")}:${nextMinute.toString().padStart(2, "0")}`

      schedules.push({ fromHour, toHour })
      currentHour = nextHour
      currentMinute = nextMinute
    }

    return schedules
  }

  const morningSchedules = generateSchedules(morningStartTime, morningEndTime, morningInterval)
  const eveningSchedules = generateSchedules(eveningStartTime, eveningEndTime, eveningInterval)

  const handleAddSubCourtSchedule = async () => {
    try {
      // Đảm bảo sử dụng đúng ngày được chọn
      const startDate = new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day)

      // Log để kiểm tra ngày
      console.log("Ngày được chọn:", selectedDate)
      console.log("Ngày bắt đầu tạo lịch:", startDate.toISOString())

      const daysToAdd = duration === "day" ? 1 : duration === "week" ? 7 : duration === "month" ? 30 : 365

      const subCourtIds = selectedCourts.includes("all")
        ? subCourts.map((subCourt) => subCourt.id)
        : selectedCourts.filter((court) => court !== "all").map((court) => Number.parseInt(court.split("-")[1]))

      const schedulesToAdd = []
      const priceValue = Number.parseFloat(price) || 0

      for (let i = 0; i < daysToAdd; i++) {
        // Tạo một bản sao mới của ngày bắt đầu để tránh thay đổi ngày gốc
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + i)

        // Format ngày theo định dạng YYYY-MM-DD
        const dateString = currentDate.toISOString().split("T")[0]

        // Log để kiểm tra từng ngày được tạo
        console.log(`Ngày thứ ${i + 1}:`, dateString)

        // Thêm lịch khung Sáng
        for (const schedule of morningSchedules) {
          for (const subCourtId of subCourtIds) {
            schedulesToAdd.push({
              courtId: courtId, // ID của sân chính
              subCourtId: subCourtId, // ID của sân phụ
              date: dateString, // Ngày áp dụng lịch
              fromHour: `${schedule.fromHour}:00`, // HH:MM:SS
              toHour: `${schedule.toHour}:00`, // HH:MM:SS
              price: priceValue, // Giá
              status: "AVAILABLE", // Trạng thái
            })
          }
        }

        // Thêm lịch khung Tối
        for (const schedule of eveningSchedules) {
          for (const subCourtId of subCourtIds) {
            schedulesToAdd.push({
              courtId: courtId,
              subCourtId: subCourtId,
              date: dateString,
              fromHour: `${schedule.fromHour}:00`,
              toHour: `${schedule.toHour}:00`,
              price: priceValue,
              status: "AVAILABLE",
            })
          }
        }
      }

      console.log("Schedules to add:", schedulesToAdd)

      // Gửi từng lịch lên backend
      for (const schedule of schedulesToAdd) {
        await subCourtScheduleApi.createSubCourtSchedule(schedule)
      }

      alert("Thêm lịch thành công!")
      onScheduleAdded()
      onClose()
    } catch (error) {
      console.error("Lỗi khi thêm lịch:", error)
      alert("Có lỗi xảy ra khi thêm lịch.")
    }
  }

  return (
    <>
      <div className="flex items-center mr-3">
        <img src={courtImage.src || "/placeholder.svg"} alt="Court" className="w-7 h-7" />
        <span className="text-lg text-primary-500 underline cursor-pointer" onClick={onOpen}>
          Thêm lịch thông minh
        </span>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[90vh]",
          body: "overflow-y-auto",
        }}
      >
        <ModalContent>
          <ModalHeader className="text-xl">Thêm lịch thông minh</ModalHeader>
          <ModalBody>
            <CheckboxGroup
              color="primary"
              value={selectedCourts}
              onValueChange={handleCourtSelectionChange}
              label="Chọn sân"
              orientation="horizontal"
              className="mb-4"
            >
              {subCourts.map((subCourt) => (
                <Checkbox key={subCourt.id} value={`subcourt-${subCourt.id}`}>
                  {subCourt.subName}
                </Checkbox>
              ))}
              <Checkbox value="all">Tất cả</Checkbox>
            </CheckboxGroup>
            <div className="flex justify-between gap-4 mb-4">
              <div className="flex-1 max-w-md">
                <RadioGroup
                  label="Khung giờ sáng"
                  orientation="horizontal"
                  value={morningInterval}
                  onValueChange={(value) => setMorningInterval(value as typeof morningInterval)}
                  color="primary"
                  className="mb-2"
                >
                  <Radio value="owntime">1 tiếng</Radio>
                  <Radio value="part-own">1,5 tiếng</Radio>
                  <Radio value="twotime">2 tiếng</Radio>
                </RadioGroup>
                <div className="flex gap-4 mb-4">
                  <TimeInput
                    label="Thời gian bắt đầu"
                    value={morningStartTime as any}
                    onChange={(value) => setMorningStartTime(value as Time | null)}
                    hourCycle={24}
                    granularity="minute"
                    placeholderValue={new Time(4, 0)}
                  />
                  <TimeInput
                    label="Thời gian kết thúc"
                    value={morningEndTime as any}
                    onChange={(value) => setMorningEndTime(value as Time | null)}
                    hourCycle={24}
                    granularity="minute"
                    placeholderValue={new Time(12, 0)}
                  />
                </div>
              </div>

              <div className="flex-1 max-w-md">
                <RadioGroup
                  label="Khung giờ tối"
                  orientation="horizontal"
                  value={eveningInterval}
                  onValueChange={(value) => setEveningInterval(value as typeof eveningInterval)}
                  color="primary"
                  className="mb-2"
                >
                  <Radio value="owntime">1 tiếng</Radio>
                  <Radio value="part-own">1,5 tiếng</Radio>
                  <Radio value="twotime">2 tiếng</Radio>
                </RadioGroup>
                <div className="flex gap-4 mb-4">
                  <TimeInput
                    label="Thời gian bắt đầu"
                    value={eveningStartTime as any}
                    onChange={(value) => setEveningStartTime(value as Time | null)}
                    hourCycle={24}
                    granularity="minute"
                    placeholderValue={new Time(13, 0)}
                  />
                  <TimeInput
                    label="Thời gian kết thúc"
                    value={eveningEndTime as any}
                    onChange={(value) => setEveningEndTime(value as Time | null)}
                    hourCycle={24}
                    granularity="minute"
                    placeholderValue={new Time(22, 0)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex-1 max-w-md">
                <DatePicker
                  label="Chọn ngày bắt đầu"
                  color="primary"
                  className="mb-4 w-full"
                  defaultValue={selectedDate}
                  value={selectedDate}
                  onChange={(date) => {
                    if (date) {
                      console.log("Ngày được chọn:", date)
                      setSelectedDate(date)
                    }
                  }}
                />
                <div className="text-sm text-gray-600">
                  Ngày bắt đầu: {selectedDate.day}/{selectedDate.month}/{selectedDate.year}
                </div>
              </div>
              <div className="flex-1 max-w-md">
                <RadioGroup
                  label="Tạo lịch cho"
                  orientation="horizontal"
                  value={duration}
                  onValueChange={(value) => setDuration(value as typeof duration)}
                  color="primary"
                  className="mb-4 flex-1 max-w-md"
                >
                  <Radio value="day">Một ngày</Radio>
                  <Radio value="week">Một tuần</Radio>
                  <Radio value="month">Một tháng</Radio>
                  <Radio value="year">Một năm</Radio>
                </RadioGroup>
              </div>
            </div>

            <Input
              label="Giá (VND)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Nhập giá"
              color="primary"
              className="max-w-md mb-4"
              min="0"
              step="0.1"
            />

            {(morningSchedules.length > 0 || eveningSchedules.length > 0) && (
              <div className="my-4">
                <p className="text-lg font-semibold">Xem trước lịch (Giá: {price} VND)</p>
                {morningSchedules.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <img src={soonImage.src || "/placeholder.svg"} alt="Morning" className="w-6 h-6" />
                      <p className="font-medium">Khung sáng:</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {morningSchedules.map((schedule, index) => (
                        <span key={index} className="px-3 py-1 bg-primary-50 rounded-lg text-gray-900">
                          {schedule.fromHour} - {schedule.toHour}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {eveningSchedules.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <img src={moonImage.src || "/placeholder.svg"} alt="Evening" className="w-6 h-6" />
                      <p className="font-medium">Khung tối:</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {eveningSchedules.map((schedule, index) => (
                        <span key={index} className="px-3 py-1 bg-primary-50 rounded-lg text-gray-900">
                          {schedule.fromHour} - {schedule.toHour}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
              onClick={handleAddSubCourtSchedule}
              disabled={
                ((!morningStartTime || !morningEndTime || morningStartTime >= morningEndTime) &&
                  (!eveningStartTime || !eveningEndTime || eveningStartTime >= eveningEndTime)) ||
                !price ||
                Number.parseFloat(price) <= 0
              }
            >
              Thêm
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddScheduleSmart