from app.data.books import BooksDB
from app.db.query.library import BookRequestsDB
from app.utils.validation import validate_email_address

from .base import BaseCore
from .exceptions import AuthorizationError, ValidationError

# Allow anonymous users to create requests
EVERYONE_CAN_ADMIN_REQUESTS = True


class LibraryCore(BaseCore):

    def __init__(self, *a, **kw):
        super().__init__(*a, **kw)
        self._requests_db = BookRequestsDB()
        self._books_db = BooksDB()

    def get_request(self, id):

        request = self._requests_db.get(id=id)

        if not self.can_access_request(request):
            raise AuthorizationError('Cannot get this request')

        return request

    def list_requests(self):

        if not self.can_list_requests():
            raise AuthorizationError('Cannot list requests')

        return self._requests_db.list()

    def create_request(self, email=None, title=None):

        # Request creation:
        # - If logged in, no need for email, attach to user
        # - If not logged in, send verification code via email
        #   - Use verification code to approve request, link/create user

        if not self.can_create_request():
            raise AuthorizationError('Cannot create requests')

        email = (email or '').strip()
        title = (title or '').strip()

        if not validate_email_address(email):
            raise ValidationError('Invalid email address')

        if not title.strip():
            raise ValidationError('Title must not be empty')

        return self._requests_db.create(email=email, title=title)

    def delete_request(self, request):

        if not self.can_delete_request(request):
            raise AuthorizationError('Cannot delete request')

        self._requests_db.delete(id=request.id)

    def list_books(self, title_prefix=None):
        books = self._books_db.list()

        if title_prefix is not None:
            books = (
                x for x in books
                if x.title.lower().startswith(title_prefix))

        return books

    def get_book(self, id):
        return self._books_db.get(id)

    # Authorization --------------------------------------------------

    def can_access_request(self, request):

        if EVERYONE_CAN_ADMIN_REQUESTS:
            return True

        auth = self.get_auth_info()

        if auth.is_superuser():
            return True

        return True

    def can_list_requests(self):

        if EVERYONE_CAN_ADMIN_REQUESTS:
            return True

        auth = self.get_auth_info()

        if auth.is_superuser():
            return True

        return True

    def can_create_request(self):

        if EVERYONE_CAN_ADMIN_REQUESTS:
            return True

        auth = self.get_auth_info()

        if auth.is_superuser():
            return True

        if auth.is_authenticated():
            return True

        return False

    def can_update_request(self, request):
        auth = self.get_auth_info()

        if auth.is_superuser():
            return True

        if auth.is_authenticated():
            return True

        return False

    def can_delete_request(self, request):

        if EVERYONE_CAN_ADMIN_REQUESTS:
            return True

        auth = self.get_auth_info()

        if auth.is_superuser():
            return True

        if auth.is_authenticated():
            return True

        return False
