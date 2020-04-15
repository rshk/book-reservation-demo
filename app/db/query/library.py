from ..schema.library import BookRequestsTable
from .base import TableDB


class BookRequestsDB(TableDB):
    table = BookRequestsTable
