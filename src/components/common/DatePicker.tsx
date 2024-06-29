import {format} from "date-fns"
import {ko} from 'date-fns/locale'
import {Calendar as CalendarIcon} from "lucide-react"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {MouseEvent} from "react";
import {ActiveModifiers} from "react-day-picker";
import {Calendar} from "@/components/ui/calendar";

interface DatePickerProps {
    date: Date;
    setDate: (day: Date | undefined, selectedDay: Date, activeModifiers: ActiveModifiers, e: MouseEvent) => void;
}

const DatePicker = ({date, setDate}: DatePickerProps) => {

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {date ? format(date, 'yyyy년 M월 d일 EEEE', {locale: ko}) : <span>날짜를 선택하세요</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

export default DatePicker