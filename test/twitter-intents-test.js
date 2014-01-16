describe('TwitterIntents', function () {
  function each(array, fn, context) {
    for (var i = 0, length = array.length; i < length; i += 1) {
      fn.call(context, array[i], i, array);
    }
  }

  // Trigger click events on an element. Returns true if the default was prevented.
  function click(el) {
    if (document.createEvent) {
      var evt = document.createEvent('HTMLEvents');
      evt.initEvent('click', true, true);
      return !el.dispatchEvent(evt);
    } else {
      var evt = document.createEventObject();
      return !el.fireEvent('onclick', evt);
    }
  }

  // Prevent links opening if the tests fail.
  if (document.addEventListener) {
    document.addEventListener('click', function (event) {
      event.preventDefault();
    }, false);
  } else if (document.attachEvent) {
    document.attachEvent('click', function () { return false; });
  }

  beforeEach(function () {
    this.fixture = document.createElement('div');
    this.fixture.innerHTML = [
      '<a id="el-1" href="http://twitter.com/intent/tweet">twitter http</a>',
      '<a id="el-2" href="https://twitter.com/intent/tweet">twitter https</a>',
      '<a id="el-3" href="//twitter.com/intent/tweet">twitter protocol-less</a>',
      '<a id="el-4" href="//twitter.com/intent/tweet"><span>twitter child elements</span></a>',
      '<a id="el-5" href="http://example.com/intent">non-twitter url</a>',
      '<a id="el-6" href="#foo">internal hash</a>',
      '<p id="el-7">non-anchor tag</p>'
    ].join('\n');

    // Fake window object!
    this.context = {
      open: sinon.spy(),
      screenTop: 50,
      screenLeft: 100,
      outerWidth: 1024,
      outerHeight: 726,
      document: {
        documentElement: {
          offsetWidth: 1024,
          offsetHeight: 726
        }
      }
    };

    this.intent = new TwitterIntents(this.fixture, this.context);

    document.body.appendChild(this.fixture);
  });

  afterEach(function () {
    document.body.removeChild(this.fixture);
  });

  describe('.register()', function () {
    beforeEach(function () {
      this.intent.register();
    });

    describe('when a twitter intent is clicked', function () {
      it('opens a popup window', function () {
        each([0, 1, 2], function (index) {
          var el = this.fixture.children[index];
          click(el);
          assert.called(this.context.open);
        }, this);
      });

      it('when a child element is clicked', function () {
        var el = this.fixture.children[3].firstChild;
        click(el);
        assert.called(this.context.open);
        assert.calledWith(this.context.open, el.parentNode.href);
      });

      it('opens the popup with the url of the clicked element', function () {
        var el = this.fixture.children[0];
        click(el);
        assert.calledWith(this.context.open, el.href);
      });

      it('prevents the default browser action', function () {
        var el = this.fixture.children[0];
        var isDefaultPrevented = click(el);
        assert(isDefaultPrevented === true, 'default event action should be prevented');
      });

      it('opens the text editor in the middle of the browser window', function () {
        var el = this.fixture.children[0];
        click(el);

        var windowOptions = this.context.open.lastCall.args[2];
        assert(windowOptions.indexOf('width=550') > -1, 'popup should be 550px wide');
        assert(windowOptions.indexOf('height=420') > -1, 'popup should be 420px high');
        assert(windowOptions.indexOf('left=337') > -1, 'popup should be horizontally centered');
        assert(windowOptions.indexOf('top=203') > -1, 'popup should be vertically centered');
      });
    });

    describe('when another element is clicked', function () {
      it('does not open a popup window', function () {
        each([4, 5, 6], function (index) {
          var el = this.fixture.children[index];
          click(el);
          assert.notCalled(this.context.open);
        }, this);
      });
    });

    describe('when calling the register a second time', function () {
      it('does not attach a second handler', function () {
        var target;

        if (this.fixture.addEventListener) {
          target = sinon.stub(this.fixture, 'addEventListener');
        } else {
          target = this.fixture.attachEvent = sinon.spy();
        }
        this.intent.register();

        assert.notCalled(target);
      });
    });
  });

  describe('.unregister()', function () {
    beforeEach(function () {
      this.intent.register();
    });

    it('unbinds the event handlers', function () {
      this.intent.unregister();

      var el = this.fixture.firstChild;
      click(el);
      assert.notCalled(this.context.open);
    });
  });
});
