# pytest_autouse_demo.py

DATE_FORMAT = '%Y-%m-%d %H:%M:%S'


@pytest.fixture(scope='session', autouse=True)
def timer_session_scope():
    start = time.time()
    print('\nstart: {}'.format(time.strftime(DATE_FORMAT, time.localtime(start))))

    yield

    finished = time.time()
    print('finished: {}'.format(time.strftime(DATE_FORMAT, time.localtime(finished))))
    print('Total time cost: {:.3f}s'.format(finished - start))


@pytest.fixture(autouse=True)
def timer_function_scope():
    start = time.time()
    yield
    print(' Time cost: {:.3f}s'.format(time.time() - start))

"""
tests\fixture\test_autouse.py
start: 2018-06-12 10:16:27
. Time cost: 1.003s.
. Time cost: 2.003s.
finished: 2018-06-12 10:16:30
Total time cost: 3.016s.
"""