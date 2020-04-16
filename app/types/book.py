from typing import NamedTuple


class Book(NamedTuple):
    id: int
    title: str
    author: str
    cover_url: str = None
