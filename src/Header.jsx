import { NavLink, useLocation } from 'react-router-dom';

function Header() {
    const { pathname } = useLocation();
    const isActive = (path) => {
        return path === '/' ? pathname === path : pathname.startsWith(path);
    };

    return (
        <header style={{ background: '#3b4df6de', borderRadius: '30px' }} className="text-white p-4 mb-4">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                <div className="text-lg font-bold">ASSISTFIN ANALYTICS</div>
                <nav>
                    <ul className="flex space-x-4">
                        {/* <li><NavLink exact to="/" activeClassName="active" className="hover:underline">Home</NavLink></li> */}
                        <li><NavLink exact="true" to="/uploadMasteData" className="hover:underline">Upload Master Data</NavLink></li>
                        <li><NavLink exact="true" to="/" className="hover:underline">Date wise</NavLink></li>
                        <li><NavLink exact="true" to="/state" className="hover:underline">State Wise</NavLink></li>
                        <li><NavLink exact="true" to="/city" className="hover:underline">City Wise</NavLink></li>
                        <li><NavLink exact="true" to="/pincode" className="hover:underline">PinCode Wise</NavLink></li>
                        <li><NavLink exact="true" to="/login" className="hover:underline">Login</NavLink></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
