export const StaticProfileInfo = ({ firstName, lastName, age, email, username, organization }) => {
    return (<>
        <div className='row'>
            <div className='col-sm-3'>
                <h6 className='mb-0'>Name</h6>
            </div>
            <div className='col-sm-9'>
                <p className='mb-0 text-muted'>{firstName} {lastName}</p>
            </div>
        </div>
        <hr />
        <div className='row'>
            <div className='col-sm-3'>
                <h6 className='mb-0'>Email</h6>
            </div>
            <div className='col-sm-9'>
                <p className='mb-0 text-muted'>{email}</p>
            </div>
        </div>
        <hr />
        <div className='row'>
            <div className='col-sm-3'>
                <h6 className='mb-0'>Username</h6>
            </div>
            <div className='col-sm-9'>
                <p className='mb-0 text-muted'>{username}</p>
            </div>
        </div>
        <hr />
        <div className='row'>
            <div className='col-sm-3'>
                <h6 className='mb-0'>Age</h6>
            </div>
            <div className='col-sm-9'>
                <p className='mb-0 text-muted'>{age}</p>
            </div>
        </div>
        <hr />
        <div className='row'>
            <div className='col-sm-3'>
                <h6 className='mb-0'>Organization</h6>
            </div>
            <div className='col-sm-9'>
                <p className='mb-0 text-muted'>{organization}</p>
            </div>
        </div>
    </>
    )
}

export const DynamicProfileInfo = ({ firstName, lastName, age, email, username }) => {
    return (<>
        <div className='row'>
            <div className='col-sm-3'>
                <h6 className='mb-0'>Name</h6>
            </div>
            <div className='col-sm-9'>
                <p className='mb-0 text-muted'>{firstName} {lastName}</p>
            </div>
        </div>
        <hr />
        <div className='row'>
            <div className='col-sm-3'>
                <h6 className='mb-0'>Email</h6>
            </div>
            <div className='col-sm-9'>
                <p className='mb-0 text-muted'>{email}</p>
            </div>
        </div>
        <hr />
        <div className='row'>
            <div className='col-sm-3'>
                <h6 className='mb-0'>Username</h6>
            </div>
            <div className='col-sm-9'>
                <p className='mb-0 text-muted'>{username}</p>
            </div>
        </div>
        <hr />
        <div className='row'>
            <div className='col-sm-3'>
                <h6 className='mb-0'>Age</h6>
            </div>
            <div className='col-sm-9'>
                <p className='mb-0 text-muted'>{age}</p>
            </div>
        </div>
    </>
    )
}