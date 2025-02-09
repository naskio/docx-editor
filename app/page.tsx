import Image from 'next/image';

export default function Page() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <>
      <Image src={`${basePath}/logo.svg`} alt='Logo' width={256} height={64} />
      <h1 className='text-3xl font-bold underline'>
        Hello, Next.js with Tailwind CSS!
      </h1>
    </>
  );
}
