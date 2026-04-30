import Link from 'next/link'

export default function Home() {
    return (
        <div className="container py-5">
            <h1 className="mb-4 fw-bold">Appliance Inventory</h1>
            <p className="text-muted mb-5">Household Appliance Inventory Management System</p>

            <div className="row g-4">
                {/* add appliance card */}
                <div className="col-md-6 col-lg-3">
                    <Link href="/add" className="text-decoration-none">
                        <div className="card h-100 border-dark">
                            <div className="card-body text-center">
                                <h5 className="card-title">Add</h5>
                                <p className="card-text text-muted">Register a new appliance</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* search appliance card */}
                <div className="col-md-6 col-lg-3">
                    <Link href="/search" className="text-decoration-none">
                        <div className="card h-100 border-dark">
                            <div className="card-body text-center">
                                <h5 className="card-title">Search</h5>
                                <p className="card-text text-muted">Find an appliance by serial number</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* update appliance card */}
                <div className="col-md-6 col-lg-3">
                    <Link href="/update" className="text-decoration-none">
                        <div className="card h-100 border-dark">
                            <div className="card-body text-center">
                                <h5 className="card-title">Update</h5>
                                <p className="card-text text-muted">Modify appliance details</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* delete appliance card */}
                <div className="col-md-6 col-lg-3">
                    <Link href="/delete" className="text-decoration-none">
                        <div className="card h-100 border-dark">
                            <div className="card-body text-center">
                                <h5 className="card-title">Delete</h5>
                                <p className="card-text text-muted">Remove an appliance record</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}