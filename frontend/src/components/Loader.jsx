import { useState } from "react";
import ClipLoader from "react-spinners/PuffLoader";



const Loader = () => {
    let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#ffffff");

    return (
        <div className="sweet-loading">

            <div className="w-12 mx-auto my-8">
                <ClipLoader
                    color={color}
                    loading={loading}
                    size={100}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>

        </div>
    );
}

export default Loader;


