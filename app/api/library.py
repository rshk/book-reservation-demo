import logging
from datetime import datetime
from typing import List

from pyql import InputObject, Object

from app.core.exceptions import UserError
from app.core.library import LibraryCore

from .base import schema

logger = logging.getLogger(__name__)


Book = Object('Book', {
    'id': int,
    'title': str,
    'author': str,
    'cover_url': str,
})


BookRequest = Object('BookRequest', {
    'id': int,
    'email': str,
    'title': str,
    'timestamp': datetime,
})


@BookRequest.field('timestamp')
def resolve_book_request_timestamp(root, info) -> datetime:
    return root.date_created


@schema.query.field('requests')
def resolve_list_requests(root, info) -> List[BookRequest]:
    core = LibraryCore.from_request()
    return list(core.list_requests())


@schema.query.field('request')
def resolve_get_request(root, info, id: int) -> BookRequest:
    core = LibraryCore.from_request()
    return core.get_request(id)


CreateRequestInput = InputObject('CreateRequestInput', {
    'email': str,
    'title': str,
})

CreateRequestOutput = Object('CreateRequestOutput', {
    'ok': bool,
    'request_id': int,
    'error_message': str,
})


@CreateRequestOutput.field('request')
def resolve_create_request_output_request(root, info) -> BookRequest:
    if root.request_id is None:
        return None

    core = LibraryCore.from_request()
    return core.get_request(root.request_id)


@schema.mutation.field('create_request')
def resolve_create_request(
        root, info, data: CreateRequestInput = None) -> CreateRequestOutput:

    core = LibraryCore.from_request()
    try:
        request_id = core.create_request(email=data.email, title=data.title)
    except UserError as e:
        return CreateRequestOutput(ok=False, error_message=str(e))

    return CreateRequestOutput(ok=True, request_id=request_id)


DeleteRequestOutput = Object('DeleteRequestOutput', {
    'ok': bool,
    'error_message': str,
})


@schema.mutation.field('delete_request')
def resolve_delete_request(root, info, id: int) -> DeleteRequestOutput:
    core = LibraryCore.from_request()
    request = core.get_request(id)
    core.delete_request(request)
    return DeleteRequestOutput(ok=True)


@schema.query.field('books')
def resolve_list_books(root, info) -> List[Book]:
    core = LibraryCore.from_request()
    return list(core.list_books())


@schema.query.field('book')
def resolve_get_book(root, info, id: int) -> Book:
    core = LibraryCore.from_request()
    return core.get_book(id)
