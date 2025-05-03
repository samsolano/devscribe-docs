type SuperscriptProps = {
    children: any
}

export default function Superscript({ children }: SuperscriptProps) {
    return (
        // <div className="my-4 space-y-4 flex flex-col bg-blue-300">
        //     <div className="text-3xl text-blue-500 font-semibold">{title}</div>
            <div className="inline-flex gap-x-2">hi     <sup>{children}</sup>      how are you</div>
        // </div>
    )
}