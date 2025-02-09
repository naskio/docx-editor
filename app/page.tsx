import Image from "next/image";

export default function Page() {
    return <>
        <Image src="/logo.svg" alt="Logo" width={256} height={64}/>
        <h1>Hello, Next.js!</h1>
    </>
}