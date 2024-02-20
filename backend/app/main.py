import uvicorn
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from app.config import db


origins= [
    "*"
]

app = FastAPI(
        title= "Blog-Post",
        description= "Side Project",
        version= ".5",
)



def init_app():
    db.init()
    global app

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
    )

    @app.on_event("startup")
    async def starup():
        await db.create_all()
    
    @app.on_event("shutdown")
    async def shutdown():
        await db.close()

    from app.controller import (
        authentication,
        users
        )
    
    
    app.include_router(authentication.router)
    app.include_router(users.router)


    return app


app = init_app()

def start():
    """Launched with 'poetry run start' at root level """
    uvicorn.run("app.main:app", host= "0.0.0.0", port=8888, reload=True)
    #uvicorn.run("app.main:app", host="localhost", port=8888, reload=True)