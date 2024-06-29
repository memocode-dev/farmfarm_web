import {useState} from "react";
import {differenceInMinutes, format, parseISO} from "date-fns";
import {CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {FindAllHouseSectionsResponseHouseSectionSensor} from "@/openapi/model";
import {useFindAllHouseSectionSensorMeasurements} from "@/openapi/api/houses/houses";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import DatePicker from "@/components/common/DatePicker";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";

interface HouseSectionSensorGraphProps {
    houseId: string;
    houseSectionId: string;
    sensor: FindAllHouseSectionsResponseHouseSectionSensor;
}

const HouseSectionSensorGraph = ({houseId, houseSectionId, sensor}: HouseSectionSensorGraphProps) => {

    const [date, setDate] =
        useState<Date>(new Date(new Date().setHours(0, 0, 0, 0)))

    const {data: houseSectionSensorData} =
        useFindAllHouseSectionSensorMeasurements(houseId, houseSectionId, sensor.id, {
            startMeasuredAt: date.toISOString(),
            endMeasuredAt: new Date(new Date(date).setDate(date.getDate() + 1)).toISOString(),
        }, {
            query: {
                queryKey: ['HouseSectionSensorGraph', date, sensor.id],
                refetchInterval: 60000,
            }
        });

    const xTicks = Array.from({length: 288}, (_, index) => {
        const hour = Math.floor(index / 12);
        const minute = (index % 12) * 5;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    });

    const filledData = xTicks.map(tick => {
        const dataPoint = houseSectionSensorData?.measurements?.find(d => {
            return format(parseISO(d.measuredAt as never), 'HH:mm') === tick
        });
        return dataPoint ? {...dataPoint, timestamp: tick} : {timestamp: tick};
    });

    // const yDomain = houseSectionSensorData?.measurements!
    //     .reduce((acc, type) => {
    //         acc.min = Math.min(acc.min, fieldStats[type.name as FieldStatsKeys].min);
    //         acc.max = Math.max(acc.max, fieldStats[type.name as FieldStatsKeys].max);
    //         return acc;
    //     }, {min: Infinity, max: -Infinity});

    return (
        <div className="w-full max-w-[375px] sm:max-w-2xl mx-auto my-[30px]">
            <div className="space-y-4">
                <div>
                    {/*{sensor.sensor?.sensorTypes*/}
                    {/*    ?.filter((type) => type.name !== "timestamp")*/}
                    {/*    ?.map(type => fieldStats[type.name as FieldStatsKeys].name).join(" / ")}*/}
                </div>
                <div className="flex items-center space-x-4">
                    <DatePicker date={date} setDate={(day, selectedDay, activeModifiers, e) => {
                        console.log(day);
                        console.log(activeModifiers);
                        console.log(e);
                        setDate(selectedDay);
                    }}/>
                    <Button onClick={() => setDate(new Date(new Date().setHours(0, 0, 0, 0)))}>오늘</Button>
                </div>
                {/*{current_house_sensor_data && <div className="border rounded p-4">*/}
                {/*    <div>*/}
                {/*        {houseSensor?.sensor?.sensorTypes*/}
                {/*            ?.filter((type) => type.name !== "timestamp")*/}
                {/*            ?.map(type => {*/}
                {/*                return (*/}
                {/*                    <div key={type.id} className="flex space-x-2 items-center my-1">*/}
                {/*                        <Badge*/}
                {/*                            className="text-[20px]">현재 {fieldStats[type.name as FieldStatsKeys].name}</Badge>*/}
                {/*                        <Badge*/}
                {/*                            className="text-[20px]">{current_house_sensor_data[type.name as FieldStatsKeys] as never} {fieldStats[type.name as FieldStatsKeys].symbol}</Badge>*/}
                {/*                        <Badge variant="secondary">*/}
                {/*                            {differenceInMinutes(new Date(), new Date(current_house_sensor_data.timestamp as never))}분전*/}
                {/*                        </Badge>*/}
                {/*                    </div>*/}
                {/*                )*/}
                {/*            })}*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*}*/}
            </div>

            <div className="!p-0">
                <div className="flex flex-col items-center px-10 pb-6">
                    <div className="relative flex w-full gap-4">
                        <div className="overflow-x-auto hover:graph_scroll_custom">
                            <LineChart
                                width={5000}
                                height={350}
                                data={filledData}
                                margin={{top: 20, right: 20, left: -20, bottom: 0}}
                            >
                                <CartesianGrid strokeDasharray="3 3"/>
                                <Tooltip labelClassName="text-[20px]" wrapperClassName="text-[20px]"/>
                                <XAxis
                                    dataKey="timestamp"
                                    tick={true}
                                    ticks={Array.from({length: 48}, (_, index) =>
                                        `${String(Math.floor(index / 2)).padStart(2, '0')}:${index % 2 === 0 ? '00' : '30'}`)}
                                />
                                <YAxis
                                    tick={true}
                                    axisLine={true}
                                    domain={[0, 100]}
                                    // domain={[yDomain.min, yDomain.max]}
                                    // ticks={Array.from({length: (yDomain.max - yDomain.min) / 10 + 1}, (_, index) => yDomain.min + index * 10)}
                                />
                                {houseSectionSensorData?.measurements?.map((measurement, index) => {
                                        return (
                                            <Line key={index} type="monotone" dataKey={measurement.measurementType} stroke="#ff7300"
                                                  name={`${measurement.measurementType}(${measurement.measurementType})`}/>
                                        )
                                    })}
                            </LineChart>
                        </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                        {/*{houseSensor?.sensor?.sensorTypes*/}
                        {/*    ?.filter((type) => type.name !== "timestamp")*/}
                        {/*    ?.map(type => {*/}
                        {/*        return (*/}
                        {/*            <div key={type.id} style={{*/}
                        {/*                color: fieldStats[type.name as FieldStatsKeys].color,*/}
                        {/*            }}>{fieldStats[type.name as FieldStatsKeys].name}({fieldStats[type.name as FieldStatsKeys].symbol})</div>*/}
                        {/*        )*/}
                        {/*    })}*/}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HouseSectionSensorGraph;