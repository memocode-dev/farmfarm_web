'use client'

interface ColorPickerProps {
    handleTheme: (color: string) => void;
}

const ColorPicker = ({handleTheme}: ColorPickerProps) => {

    const colors = [
        {colorHSL: "0 72% 51%", backgroundColor: "#DC2726"},
        {colorHSL: "25 95% 53%", backgroundColor: "#F97316"},
        {colorHSL: "48 96% 53%", backgroundColor: "#FACC15"},
        {colorHSL: "142 76% 36%", backgroundColor: "#16A34A"},
        {colorHSL: "221 83% 53%", backgroundColor: "#2463EB"},
        {colorHSL: "222.2 47.4% 11.2%", backgroundColor: "#2E3343"},
        {colorHSL: "261 83% 59%", backgroundColor: "#7C41ED"},
        {colorHSL: "301 79% 63%", backgroundColor: "#EB58E8"},
        {colorHSL: "207 76% 60%", backgroundColor: "#4DA1E7"},
        {colorHSL: "170 74% 59%", backgroundColor: "#48E4CA"},
    ];

    return (
        <div className="grid grid-cols-5 gap-3 justify-around">
            {colors.map((color, index) => (
                <div
                    key={index}
                    onClick={() => handleTheme(color.colorHSL)}
                    className="rounded-full w-[24px] h-[24px]"
                    style={{backgroundColor: color.backgroundColor}}
                />
            ))}
        </div>
    )
}

export default ColorPicker;