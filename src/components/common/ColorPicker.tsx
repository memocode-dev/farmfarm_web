'use client'

interface ColorPickerProps {
    handleTheme: (color: string) => void;
}

const ColorPicker = ({handleTheme}: ColorPickerProps) => {

    const colors = [
        {colorHSL: "0 84% 67%", backgroundColor: "#f16363", fontColor: "0 0% 100%"},
        {colorHSL: "22 97% 69%", backgroundColor: "#fd9c63", fontColor: "0 0% 100%"},
        {colorHSL: "42 100% 71%", backgroundColor: "#ffd26b", fontColor: "222.2 47.4% 11.2%"},
        {colorHSL: "142 44% 55%", backgroundColor: "#59bf7f", fontColor: "0 0% 100%"},
        {colorHSL: "216 88% 65%", backgroundColor: "#5696f4", fontColor: "0 0% 100%"},
        {colorHSL: "234 89% 74%", backgroundColor: "#818cf8", fontColor: "0 0% 100%"},
        {colorHSL: "335 66% 63%", backgroundColor: "#df6094", fontColor: "0 0% 100%"},
        {colorHSL: "274 68% 65%", backgroundColor: "#af6be3", fontColor: "0 0% 100%"},
        {colorHSL: "173 53% 56%", backgroundColor: "#52cabc", fontColor: "222.2 47.4% 11.2%"},
        {colorHSL: "222.2 47.4% 11.2%", backgroundColor: "#2E3343", fontColor: "0 0% 100%"}
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