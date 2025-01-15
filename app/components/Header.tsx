// app/components/Header.tsx
import Link from 'next/link';
import '../../styles/styles.css'; 

export default function TopMenu() {
    return (
        <nav className="bg-black text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
                <Link href="/" passHref>
                    <img 
                        src="/images/tarzanai-logo.png" 
                        alt="TarzanAI Logo"
                        className="w-10 h-9 cursor-pointer hover-animation" 
                    />
                </Link>
                <div className="text-2xl font-bold ml-2">TarzanAI</div>
            </div>
            <ul className="flex space-x-2">
                <li><a href="/" className="nav-item">Home</a></li>
                <li><a href="/features" className="nav-item">Features</a></li>
                <li><a href="/user-demo" className="nav-item">User Demo</a></li>
            </ul>
        </nav>
    );
}
