describe('TwitterIntents', function () {
  // Trigger click events on an element.
  function click(el) {
    if (document.createEvent) {
      var evt = document.createEvent('HTMLEvents');
      evt.initEvent('click', true, true);
      return !el.dispatchEvent(evt);
    } else {
      var evt = document.createEventObject();
      return el.fireEvent('onclick', evt);
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

    this.context = {
      open: sinon.spy(),
      screen: {
        width: 1024,
        height: 726
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
        [1, 2, 3].forEach(function (id) {
          var el = this.fixture.querySelector('#el-' + id);
          click(el);
          assert.called(this.context.open);
        }, this);
      });

      it('when a child element is clicked', function () {
        var el = this.fixture.querySelector('#el-4 span');
        click(el);
        assert.called(this.context.open);
        assert.calledWith(this.context.open, el.parentNode.href);
      });

      it('opens the popup with the url of the clicked element', function () {
        var el = this.fixture.querySelector('#el-1');
        click(el);
        assert.calledWith(this.context.open, el.href);
      });

      it('prevents the default browser action', function () {
        var el = this.fixture.querySelector('#el-1');
        var isDefaultPrevented = click(el);
        assert(isDefaultPrevented === true, 'default event action should be prevented');
      });

      it('opens the text editor in the middle of the browser window', function () {
        var el = this.fixture.querySelector('#el-1');
        click(el);

        var windowOptions = this.context.open.lastCall.args[2];
        assert(windowOptions.indexOf('width=550') > -1, 'popup should be 550px wide');
        assert(windowOptions.indexOf('height=420') > -1, 'popup should be 420px high');
        assert(windowOptions.indexOf('left=237') > -1, 'popup should be horizontally centered');
        assert(windowOptions.indexOf('top=153') > -1, 'popup should be vertically centered');
      });
    });

    describe('when another element is clicked', function () {
      it('does not open a popup window', function () {
        [5, 6, 7].forEach(function (id) {
          var el = this.fixture.querySelector('#el-' + id);
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
          target = sinon.stub(this.fixture, 'attachEvent');
        }
        this.intent.register();

        assert.notCalled(target);
        target.restore();
      });
    });
  });

  describe('.unregister()', function () {
    beforeEach(function () {
      this.intent.register();
    });

    it('unbinds the event handlers', function () {
      this.intent.unregister();

      var el = this.fixture.querySelector('#el-1');
      click(el);
      assert.notCalled(this.context.open);
    });
  });
});
