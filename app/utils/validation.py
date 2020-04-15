def validate_email_address(email):

    # Email address validation is a complex topic. What kind of
    # validation depends on what we want to achieve by it.
    # Generally, we can just do minimal validation (contains a '@'
    # sign, possibly validate name after the @ to be a valid domain),
    # then send an email with a verification link.
    # To prevent typos, some form of warning in case of common
    # misspellings could be more advisable (eg. if the user enters
    # "example@gmial.com", show a "Did you mean example@gmail.com?"
    # message).

    if not isinstance(email, str):
        raise TypeError('Email address must be a string')

    return '@' in email
