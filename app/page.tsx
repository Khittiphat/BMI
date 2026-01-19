import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 text-gray-800">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col">
        <h1 className="text-5xl font-bold mb-8 text-blue-600">BMI Web Application</h1>
        <p className="text-xl mb-12 text-center max-w-2xl">
          ระบบติดตามและวิเคราะห์ดัชนีมวลกาย (BMI) พร้อมรายงานสถิติย้อนหลัง
        </p>
        
        <div className="flex gap-6">
          <Link 
            href="/login" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
          >
            เข้าสู่ระบบ (Login)
          </Link>
          <Link 
            href="/register" 
            className="bg-white hover:bg-gray-100 text-blue-600 border-2 border-blue-600 font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
          >
            ลงทะเบียน (Register)
          </Link>
        </div>
      </div>
    </main>
  );
}
