
type NoteProps = {
    children: any
    title: string
}

export default function Note({ children, title }: NoteProps) {
    return (
        <div className="flex items-center bg-sky-900 border border-sky-600 text-blue-100 px-4 py-3 mt-5 mb-5 rounded-2xl">

  {/* <svg xmlns="http://www.w3.org/2000/svg"
       className="w-5 h-5 flex-shrink-0 text-blue-400 mr-2"
       fill="none"
       viewBox="0 0 24 24"
       stroke="currentColor"
       stroke-width="2">
    <path stroke-linecap="round"
          stroke-linejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
  </svg> */}

  <p className="text-sm text-sky-200">
    This adds a note in the content
  </p>
</div>
    )
}