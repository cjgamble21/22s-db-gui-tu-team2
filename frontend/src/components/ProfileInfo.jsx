import InputField from "./InputField"

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

export const DynamicProfileInfo = ({ name, setName, age, setAge, email, setEmail, username, setUsername, organization, setOrganization }) => {
    return (<>
        <div className='row'>
            <div className='col-sm-3'>
                <h6 className="mb-0">Name</h6>
            </div>
            <div className='col-sm-9'>
                <InputField type="text" id="name" placeholder={name} value={name} setValue={setName} />
            </div>
        </div>
        <hr />
        <div className='row'>
            <div className='col-sm-3'>
                <h6 className='mb-0'>Email</h6>
            </div>
            <div className='col-sm-9'>
                <InputField type="text" id="email" placeholder={email} value={email} setValue={setEmail} />
            </div>
        </div>
        <hr />
        <div className='row'>
            <div className='col-sm-3'>
                <h6 className='mb-0'>Username</h6>
            </div>
            <div className='col-sm-9'>
                <InputField type="text" id="username" placeholder={username} value={username} setValue={setUsername} />
            </div>
        </div>
        <hr />
        <div className='row'>
            <div className='col-sm-3'>
                <h6 className='mb-0'>Age</h6>
            </div>
            <div className='col-sm-9'>
                <InputField type="text" id="age" placeholder={age} value={age} setValue={setAge} />
            </div>
        </div>
        <hr />
        <div className='row'>
            <div className='col-sm-3'>
                <h6 className='mb-0'>Organization</h6>
            </div>
            <div className='col-sm-9'>
                <InputField type="text" id="organization" placeholder={organization} value={organization} setValue={setOrganization} />
            </div>
        </div>
    </>
    )
}