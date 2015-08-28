//= require jquery
//= require jquery_ujs
//= require turbolinks
/*!
 * Bootstrap v3.3.5 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.5
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.5
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.5'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.5
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.5'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.5
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.5'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.5
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.5'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.5
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.5'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.5
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.5'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.5
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.5'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.5
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.5'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.5
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.5'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.5
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.5'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.5
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.5'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

;(function() {
"use strict";

/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A component handler interface using the revealing module design pattern.
 * More details on this design pattern here:
 * https://github.com/jasonmayes/mdl-component-design-pattern
 *
 * @author Jason Mayes.
 */
/* exported componentHandler */
window.componentHandler = (function() {
  'use strict';

  /** @type {!Array<componentHandler.ComponentConfig>} */
  var registeredComponents_ = [];

  /** @type {!Array<componentHandler.Component>} */
  var createdComponents_ = [];

  var downgradeMethod_ = 'mdlDowngrade_';
  var componentConfigProperty_ = 'mdlComponentConfigInternal_';

  /**
   * Searches registered components for a class we are interested in using.
   * Optionally replaces a match with passed object if specified.
   *
   * @param {String} name The name of a class we want to use.
   * @param {componentHandler.ComponentConfig=} optReplace Optional object to replace match with.
   * @return {!Object|Boolean}
   * @private
   */
  function findRegisteredClass_(name, optReplace) {
    for (var i = 0; i < registeredComponents_.length; i++) {
      if (registeredComponents_[i].className === name) {
        if (optReplace !== undefined) {
          registeredComponents_[i] = optReplace;
        }
        return registeredComponents_[i];
      }
    }
    return false;
  }

  /**
   * Returns an array of the classNames of the upgraded classes on the element.
   *
   * @param {!HTMLElement} element The element to fetch data from.
   * @return {!Array<String>}
   * @private
   */
  function getUpgradedListOfElement_(element) {
    var dataUpgraded = element.getAttribute('data-upgraded');
    // Use `['']` as default value to conform the `,name,name...` style.
    return dataUpgraded === null ? [''] : dataUpgraded.split(',');
  }

  /**
   * Returns true if the given element has already been upgraded for the given
   * class.
   *
   * @param {!HTMLElement} element The element we want to check.
   * @param {String} jsClass The class to check for.
   * @returns {Boolean}
   * @private
   */
  function isElementUpgraded_(element, jsClass) {
    var upgradedList = getUpgradedListOfElement_(element);
    return upgradedList.indexOf(jsClass) !== -1;
  }

  /**
   * Searches existing DOM for elements of our component type and upgrades them
   * if they have not already been upgraded.
   *
   * @param {String=} optJsClass the programatic name of the element class we
   * need to create a new instance of.
   * @param {String=} optCssClass the name of the CSS class elements of this
   * type will have.
   */
  function upgradeDomInternal(optJsClass, optCssClass) {
    if (optJsClass === undefined && optCssClass === undefined) {
      for (var i = 0; i < registeredComponents_.length; i++) {
        upgradeDomInternal(registeredComponents_[i].className,
            registeredComponents_[i].cssClass);
      }
    } else {
      var jsClass = /** @type {String} */ (optJsClass);
      if (optCssClass === undefined) {
        var registeredClass = findRegisteredClass_(jsClass);
        if (registeredClass) {
          optCssClass = registeredClass.cssClass;
        }
      }

      var elements = document.querySelectorAll('.' + optCssClass);
      for (var n = 0; n < elements.length; n++) {
        upgradeElementInternal(elements[n], jsClass);
      }
    }
  }

  /**
   * Upgrades a specific element rather than all in the DOM.
   *
   * @param {!HTMLElement} element The element we wish to upgrade.
   * @param {String=} optJsClass Optional name of the class we want to upgrade
   * the element to.
   */
  function upgradeElementInternal(element, optJsClass) {
    // Verify argument type.
    if (!(typeof element === 'object' && element instanceof Element)) {
      throw new Error('Invalid argument provided to upgrade MDL element.');
    }
    var upgradedList = getUpgradedListOfElement_(element);
    var classesToUpgrade = [];
    // If jsClass is not provided scan the registered components to find the
    // ones matching the element's CSS classList.
    if (!optJsClass) {
      var classList = element.classList;
      registeredComponents_.forEach(function(component) {
        // Match CSS & Not to be upgraded & Not upgraded.
        if (classList.contains(component.cssClass) &&
            classesToUpgrade.indexOf(component) === -1 &&
            !isElementUpgraded_(element, component.className)) {
          classesToUpgrade.push(component);
        }
      });
    } else if (!isElementUpgraded_(element, optJsClass)) {
      classesToUpgrade.push(findRegisteredClass_(optJsClass));
    }

    // Upgrade the element for each classes.
    for (var i = 0, n = classesToUpgrade.length, registeredClass; i < n; i++) {
      registeredClass = classesToUpgrade[i];
      if (registeredClass) {
        // Mark element as upgraded.
        upgradedList.push(registeredClass.className);
        element.setAttribute('data-upgraded', upgradedList.join(','));
        var instance = new registeredClass.classConstructor(element);
        instance[componentConfigProperty_] = registeredClass;
        createdComponents_.push(instance);
        // Call any callbacks the user has registered with this component type.
        for (var j = 0, m = registeredClass.callbacks.length; j < m; j++) {
          registeredClass.callbacks[j](element);
        }

        if (registeredClass.widget) {
          // Assign per element instance for control over API
          element[registeredClass.className] = instance;
        }
      } else {
        throw new Error(
          'Unable to find a registered component for the given class.');
      }

      var ev = document.createEvent('Events');
      ev.initEvent('mdl-componentupgraded', true, true);
      element.dispatchEvent(ev);
    }
  }

  /**
   * Upgrades a specific list of elements rather than all in the DOM.
   *
   * @param {!HTMLElement|!Array<!HTMLElement>|!NodeList|!HTMLCollection} elements
   * The elements we wish to upgrade.
   */
  function upgradeElementsInternal(elements) {
    if (!Array.isArray(elements)) {
      if (typeof elements.item === 'function') {
        elements = Array.prototype.slice.call(/** @type {Array} */ (elements));
      } else {
        elements = [elements];
      }
    }
    for (var i = 0, n = elements.length, element; i < n; i++) {
      element = elements[i];
      if (element instanceof HTMLElement) {
        if (element.children.length > 0) {
          upgradeElementsInternal(element.children);
        }
        upgradeElementInternal(element);
      }
    }
  }

  /**
   * Registers a class for future use and attempts to upgrade existing DOM.
   *
   * @param {{constructor: !Function, classAsString: String, cssClass: String, widget: String}} config
   */
  function registerInternal(config) {
    var newConfig = /** @type {componentHandler.ComponentConfig} */ ({
      'classConstructor': config.constructor,
      'className': config.classAsString,
      'cssClass': config.cssClass,
      'widget': config.widget === undefined ? true : config.widget,
      'callbacks': []
    });

    registeredComponents_.forEach(function(item) {
      if (item.cssClass === newConfig.cssClass) {
        throw new Error('The provided cssClass has already been registered.');
      }
      if (item.className === newConfig.className) {
        throw new Error('The provided className has already been registered');
      }
    });

    if (config.constructor.prototype
        .hasOwnProperty(componentConfigProperty_)) {
      throw new Error(
          'MDL component classes must not have ' + componentConfigProperty_ +
          ' defined as a property.');
    }

    var found = findRegisteredClass_(config.classAsString, newConfig);

    if (!found) {
      registeredComponents_.push(newConfig);
    }
  }

  /**
   * Allows user to be alerted to any upgrades that are performed for a given
   * component type
   *
   * @param {String} jsClass The class name of the MDL component we wish
   * to hook into for any upgrades performed.
   * @param {function(!HTMLElement)} callback The function to call upon an
   * upgrade. This function should expect 1 parameter - the HTMLElement which
   * got upgraded.
   */
  function registerUpgradedCallbackInternal(jsClass, callback) {
    var regClass = findRegisteredClass_(jsClass);
    if (regClass) {
      regClass.callbacks.push(callback);
    }
  }

  /**
   * Upgrades all registered components found in the current DOM. This is
   * automatically called on window load.
   */
  function upgradeAllRegisteredInternal() {
    for (var n = 0; n < registeredComponents_.length; n++) {
      upgradeDomInternal(registeredComponents_[n].className);
    }
  }

  /**
   * Finds a created component by a given DOM node.
   *
   * @param {!Node} node
   * @return {*}
   */
  function findCreatedComponentByNodeInternal(node) {
    for (var n = 0; n < createdComponents_.length; n++) {
      var component = createdComponents_[n];
      if (component.element_ === node) {
        return component;
      }
    }
  }

  /**
   * Check the component for the downgrade method.
   * Execute if found.
   * Remove component from createdComponents list.
   *
   * @param {*} component
   */
  function deconstructComponentInternal(component) {
    if (component &&
        component[componentConfigProperty_]
          .classConstructor.prototype
          .hasOwnProperty(downgradeMethod_)) {
      component[downgradeMethod_]();
      var componentIndex = createdComponents_.indexOf(component);
      createdComponents_.splice(componentIndex, 1);

      var upgrades = component.element_.getAttribute('data-upgraded').split(',');
      var componentPlace = upgrades.indexOf(
          component[componentConfigProperty_].classAsString);
      upgrades.splice(componentPlace, 1);
      component.element_.setAttribute('data-upgraded', upgrades.join(','));

      var ev = document.createEvent('Events');
      ev.initEvent('mdl-componentdowngraded', true, true);
      component.element_.dispatchEvent(ev);
    }
  }

  /**
   * Downgrade either a given node, an array of nodes, or a NodeList.
   *
   * @param {!Node|!Array<!Node>|!NodeList} nodes
   */
  function downgradeNodesInternal(nodes) {
    var downgradeNode = function(node) {
      deconstructComponentInternal(findCreatedComponentByNodeInternal(node));
    };
    if (nodes instanceof Array || nodes instanceof NodeList) {
      for (var n = 0; n < nodes.length; n++) {
        downgradeNode(nodes[n]);
      }
    } else if (nodes instanceof Node) {
      downgradeNode(nodes);
    } else {
      throw new Error('Invalid argument provided to downgrade MDL nodes.');
    }
  }

  // Now return the functions that should be made public with their publicly
  // facing names...
  return {
    upgradeDom: upgradeDomInternal,
    upgradeElement: upgradeElementInternal,
    upgradeElements: upgradeElementsInternal,
    upgradeAllRegistered: upgradeAllRegisteredInternal,
    registerUpgradedCallback: registerUpgradedCallbackInternal,
    register: registerInternal,
    downgradeElements: downgradeNodesInternal
  };
})();

window.addEventListener('load', function() {
  'use strict';

  /**
   * Performs a "Cutting the mustard" test. If the browser supports the features
   * tested, adds a mdl-js class to the <html> element. It then upgrades all MDL
   * components requiring JavaScript.
   */
  if ('classList' in document.createElement('div') &&
      'querySelector' in document &&
      'addEventListener' in window && Array.prototype.forEach) {
    document.documentElement.classList.add('mdl-js');
    componentHandler.upgradeAllRegistered();
  } else {
    componentHandler.upgradeElement =
        componentHandler.register = function() {};
  }
});

/**
 * Describes the type of a registered component type managed by
 * componentHandler. Provided for benefit of the Closure compiler.
 *
 * @typedef {{
 *   constructor: !Function,
 *   className: String,
 *   cssClass: String,
 *   widget: String,
 *   callbacks: !Array<function(!HTMLElement)>
 * }}
 */
componentHandler.ComponentConfig;  // jshint ignore:line

/**
 * Created component (i.e., upgraded element) type as managed by
 * componentHandler. Provided for benefit of the Closure compiler.
 *
 * @typedef {{
 *   element_: !HTMLElement,
 *   className: String,
 *   classAsString: String,
 *   cssClass: String,
 *   widget: String
 * }}
 */
componentHandler.Component;  // jshint ignore:line

// Source: https://github.com/darius/requestAnimationFrame/blob/master/requestAnimationFrame.js
// Adapted from https://gist.github.com/paulirish/1579671 which derived from
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller.
// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon
// MIT license
if (!Date.now) {
    Date.now = function () {
        return new Date().getTime();
    };
}
var vendors = [
    'webkit',
    'moz'
];
for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    var vp = vendors[i];
    window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame'];
}
if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    var lastTime = 0;
    window.requestAnimationFrame = function (callback) {
        var now = Date.now();
        var nextTime = Math.max(lastTime + 16, now);
        return setTimeout(function () {
            callback(lastTime = nextTime);
        }, nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
}
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Button MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @param {HTMLElement} element The element that will be upgraded.
   */
var MaterialButton = function MaterialButton(element) {
    this.element_ = element;
    // Initialize instance.
    this.init();
};
window.MaterialButton = MaterialButton;
/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {String | Number}
   * @private
   */
MaterialButton.prototype.Constant_ = {};
/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {String}
   * @private
   */
MaterialButton.prototype.CssClasses_ = {
    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
    RIPPLE_CONTAINER: 'mdl-button__ripple-container',
    RIPPLE: 'mdl-ripple'
};
/**
   * Handle blur of element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialButton.prototype.blurHandler_ = function (event) {
    if (event) {
        this.element_.blur();
    }
};
// Public methods.
/**
   * Disable button.
   *
   * @public
   */
MaterialButton.prototype.disable = function () {
    this.element_.disabled = true;
};
/**
   * Enable button.
   *
   * @public
   */
MaterialButton.prototype.enable = function () {
    this.element_.disabled = false;
};
/**
   * Initialize element.
   */
MaterialButton.prototype.init = function () {
    if (this.element_) {
        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
            var rippleContainer = document.createElement('span');
            rippleContainer.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
            this.rippleElement_ = document.createElement('span');
            this.rippleElement_.classList.add(this.CssClasses_.RIPPLE);
            rippleContainer.appendChild(this.rippleElement_);
            this.boundRippleBlurHandler = this.blurHandler_.bind(this);
            this.rippleElement_.addEventListener('mouseup', this.boundRippleBlurHandler);
            this.element_.appendChild(rippleContainer);
        }
        this.boundButtonBlurHandler = this.blurHandler_.bind(this);
        this.element_.addEventListener('mouseup', this.boundButtonBlurHandler);
        this.element_.addEventListener('mouseleave', this.boundButtonBlurHandler);
    }
};
/**
   * Downgrade the element.
   *
   * @private
   */
MaterialButton.prototype.mdlDowngrade_ = function () {
    if (this.rippleElement_) {
        this.rippleElement_.removeEventListener('mouseup', this.boundRippleBlurHandler);
    }
    this.element_.removeEventListener('mouseup', this.boundButtonBlurHandler);
    this.element_.removeEventListener('mouseleave', this.boundButtonBlurHandler);
};
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialButton,
    classAsString: 'MaterialButton',
    cssClass: 'mdl-js-button',
    widget: true
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Checkbox MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @param {HTMLElement} element The element that will be upgraded.
   */
var MaterialCheckbox = function MaterialCheckbox(element) {
    this.element_ = element;
    // Initialize instance.
    this.init();
};
window.MaterialCheckbox = MaterialCheckbox;
/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {String | Number}
   * @private
   */
MaterialCheckbox.prototype.Constant_ = { TINY_TIMEOUT: 0.001 };
/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {String}
   * @private
   */
MaterialCheckbox.prototype.CssClasses_ = {
    INPUT: 'mdl-checkbox__input',
    BOX_OUTLINE: 'mdl-checkbox__box-outline',
    FOCUS_HELPER: 'mdl-checkbox__focus-helper',
    TICK_OUTLINE: 'mdl-checkbox__tick-outline',
    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
    RIPPLE_CONTAINER: 'mdl-checkbox__ripple-container',
    RIPPLE_CENTER: 'mdl-ripple--center',
    RIPPLE: 'mdl-ripple',
    IS_FOCUSED: 'is-focused',
    IS_DISABLED: 'is-disabled',
    IS_CHECKED: 'is-checked',
    IS_UPGRADED: 'is-upgraded'
};
/**
   * Handle change of state.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialCheckbox.prototype.onChange_ = function (event) {
    this.updateClasses_();
};
/**
   * Handle focus of element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialCheckbox.prototype.onFocus_ = function (event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
};
/**
   * Handle lost focus of element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialCheckbox.prototype.onBlur_ = function (event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
};
/**
   * Handle mouseup.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialCheckbox.prototype.onMouseUp_ = function (event) {
    this.blur_();
};
/**
   * Handle class updates.
   *
   * @private
   */
MaterialCheckbox.prototype.updateClasses_ = function () {
    this.checkDisabled();
    this.checkToggleState();
};
/**
   * Add blur.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialCheckbox.prototype.blur_ = function (event) {
    // TODO: figure out why there's a focus event being fired after our blur,
    // so that we can avoid this hack.
    window.setTimeout(function () {
        this.inputElement_.blur();
    }.bind(this), this.Constant_.TINY_TIMEOUT);
};
// Public methods.
/**
   * Check the inputs toggle state and update display.
   *
   * @public
   */
MaterialCheckbox.prototype.checkToggleState = function () {
    if (this.inputElement_.checked) {
        this.element_.classList.add(this.CssClasses_.IS_CHECKED);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
    }
};
/**
   * Check the inputs disabled state and update display.
   *
   * @public
   */
MaterialCheckbox.prototype.checkDisabled = function () {
    if (this.inputElement_.disabled) {
        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
};
/**
   * Disable checkbox.
   *
   * @public
   */
MaterialCheckbox.prototype.disable = function () {
    this.inputElement_.disabled = true;
    this.updateClasses_();
};
/**
   * Enable checkbox.
   *
   * @public
   */
MaterialCheckbox.prototype.enable = function () {
    this.inputElement_.disabled = false;
    this.updateClasses_();
};
/**
   * Check checkbox.
   *
   * @public
   */
MaterialCheckbox.prototype.check = function () {
    this.inputElement_.checked = true;
    this.updateClasses_();
};
/**
   * Uncheck checkbox.
   *
   * @public
   */
MaterialCheckbox.prototype.uncheck = function () {
    this.inputElement_.checked = false;
    this.updateClasses_();
};
/**
   * Initialize element.
   */
MaterialCheckbox.prototype.init = function () {
    if (this.element_) {
        this.inputElement_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);
        var boxOutline = document.createElement('span');
        boxOutline.classList.add(this.CssClasses_.BOX_OUTLINE);
        var tickContainer = document.createElement('span');
        tickContainer.classList.add(this.CssClasses_.FOCUS_HELPER);
        var tickOutline = document.createElement('span');
        tickOutline.classList.add(this.CssClasses_.TICK_OUTLINE);
        boxOutline.appendChild(tickOutline);
        this.element_.appendChild(tickContainer);
        this.element_.appendChild(boxOutline);
        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
            this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
            this.rippleContainerElement_ = document.createElement('span');
            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_EFFECT);
            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER);
            this.boundRippleMouseUp = this.onMouseUp_.bind(this);
            this.rippleContainerElement_.addEventListener('mouseup', this.boundRippleMouseUp);
            var ripple = document.createElement('span');
            ripple.classList.add(this.CssClasses_.RIPPLE);
            this.rippleContainerElement_.appendChild(ripple);
            this.element_.appendChild(this.rippleContainerElement_);
        }
        this.boundInputOnChange = this.onChange_.bind(this);
        this.boundInputOnFocus = this.onFocus_.bind(this);
        this.boundInputOnBlur = this.onBlur_.bind(this);
        this.boundElementMouseUp = this.onMouseUp_.bind(this);
        this.inputElement_.addEventListener('change', this.boundInputOnChange);
        this.inputElement_.addEventListener('focus', this.boundInputOnFocus);
        this.inputElement_.addEventListener('blur', this.boundInputOnBlur);
        this.element_.addEventListener('mouseup', this.boundElementMouseUp);
        this.updateClasses_();
        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
};
/**
   * Downgrade the component.
   *
   * @private
   */
MaterialCheckbox.prototype.mdlDowngrade_ = function () {
    if (this.rippleContainerElement_) {
        this.rippleContainerElement_.removeEventListener('mouseup', this.boundRippleMouseUp);
    }
    this.inputElement_.removeEventListener('change', this.boundInputOnChange);
    this.inputElement_.removeEventListener('focus', this.boundInputOnFocus);
    this.inputElement_.removeEventListener('blur', this.boundInputOnBlur);
    this.element_.removeEventListener('mouseup', this.boundElementMouseUp);
};
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialCheckbox,
    classAsString: 'MaterialCheckbox',
    cssClass: 'mdl-js-checkbox',
    widget: true
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for icon toggle MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @param {HTMLElement} element The element that will be upgraded.
   */
var MaterialIconToggle = function MaterialIconToggle(element) {
    this.element_ = element;
    // Initialize instance.
    this.init();
};
window.MaterialIconToggle = MaterialIconToggle;
/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {String | Number}
   * @private
   */
MaterialIconToggle.prototype.Constant_ = { TINY_TIMEOUT: 0.001 };
/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {String}
   * @private
   */
MaterialIconToggle.prototype.CssClasses_ = {
    INPUT: 'mdl-icon-toggle__input',
    JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
    RIPPLE_CONTAINER: 'mdl-icon-toggle__ripple-container',
    RIPPLE_CENTER: 'mdl-ripple--center',
    RIPPLE: 'mdl-ripple',
    IS_FOCUSED: 'is-focused',
    IS_DISABLED: 'is-disabled',
    IS_CHECKED: 'is-checked'
};
/**
   * Handle change of state.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialIconToggle.prototype.onChange_ = function (event) {
    this.updateClasses_();
};
/**
   * Handle focus of element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialIconToggle.prototype.onFocus_ = function (event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
};
/**
   * Handle lost focus of element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialIconToggle.prototype.onBlur_ = function (event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
};
/**
   * Handle mouseup.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialIconToggle.prototype.onMouseUp_ = function (event) {
    this.blur_();
};
/**
   * Handle class updates.
   *
   * @private
   */
MaterialIconToggle.prototype.updateClasses_ = function () {
    this.checkDisabled();
    this.checkToggleState();
};
/**
   * Add blur.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialIconToggle.prototype.blur_ = function (event) {
    // TODO: figure out why there's a focus event being fired after our blur,
    // so that we can avoid this hack.
    window.setTimeout(function () {
        this.inputElement_.blur();
    }.bind(this), this.Constant_.TINY_TIMEOUT);
};
// Public methods.
/**
   * Check the inputs toggle state and update display.
   *
   * @public
   */
MaterialIconToggle.prototype.checkToggleState = function () {
    if (this.inputElement_.checked) {
        this.element_.classList.add(this.CssClasses_.IS_CHECKED);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
    }
};
/**
   * Check the inputs disabled state and update display.
   *
   * @public
   */
MaterialIconToggle.prototype.checkDisabled = function () {
    if (this.inputElement_.disabled) {
        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
};
/**
   * Disable icon toggle.
   *
   * @public
   */
MaterialIconToggle.prototype.disable = function () {
    this.inputElement_.disabled = true;
    this.updateClasses_();
};
/**
   * Enable icon toggle.
   *
   * @public
   */
MaterialIconToggle.prototype.enable = function () {
    this.inputElement_.disabled = false;
    this.updateClasses_();
};
/**
   * Check icon toggle.
   *
   * @public
   */
MaterialIconToggle.prototype.check = function () {
    this.inputElement_.checked = true;
    this.updateClasses_();
};
/**
   * Uncheck icon toggle.
   *
   * @public
   */
MaterialIconToggle.prototype.uncheck = function () {
    this.inputElement_.checked = false;
    this.updateClasses_();
};
/**
   * Initialize element.
   */
MaterialIconToggle.prototype.init = function () {
    if (this.element_) {
        this.inputElement_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);
        if (this.element_.classList.contains(this.CssClasses_.JS_RIPPLE_EFFECT)) {
            this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
            this.rippleContainerElement_ = document.createElement('span');
            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
            this.rippleContainerElement_.classList.add(this.CssClasses_.JS_RIPPLE_EFFECT);
            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER);
            this.boundRippleMouseUp = this.onMouseUp_.bind(this);
            this.rippleContainerElement_.addEventListener('mouseup', this.boundRippleMouseUp);
            var ripple = document.createElement('span');
            ripple.classList.add(this.CssClasses_.RIPPLE);
            this.rippleContainerElement_.appendChild(ripple);
            this.element_.appendChild(this.rippleContainerElement_);
        }
        this.boundInputOnChange = this.onChange_.bind(this);
        this.boundInputOnFocus = this.onFocus_.bind(this);
        this.boundInputOnBlur = this.onBlur_.bind(this);
        this.boundElementOnMouseUp = this.onMouseUp_.bind(this);
        this.inputElement_.addEventListener('change', this.boundInputOnChange);
        this.inputElement_.addEventListener('focus', this.boundInputOnFocus);
        this.inputElement_.addEventListener('blur', this.boundInputOnBlur);
        this.element_.addEventListener('mouseup', this.boundElementOnMouseUp);
        this.updateClasses_();
        this.element_.classList.add('is-upgraded');
    }
};
/**
   * Downgrade the component
   *
   * @private
   */
MaterialIconToggle.prototype.mdlDowngrade_ = function () {
    if (this.rippleContainerElement_) {
        this.rippleContainerElement_.removeEventListener('mouseup', this.boundRippleMouseUp);
    }
    this.inputElement_.removeEventListener('change', this.boundInputOnChange);
    this.inputElement_.removeEventListener('focus', this.boundInputOnFocus);
    this.inputElement_.removeEventListener('blur', this.boundInputOnBlur);
    this.element_.removeEventListener('mouseup', this.boundElementOnMouseUp);
};
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialIconToggle,
    classAsString: 'MaterialIconToggle',
    cssClass: 'mdl-js-icon-toggle',
    widget: true
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for dropdown MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @param {HTMLElement} element The element that will be upgraded.
   */
var MaterialMenu = function MaterialMenu(element) {
    this.element_ = element;
    // Initialize instance.
    this.init();
};
window.MaterialMenu = MaterialMenu;
/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {String | Number}
   * @private
   */
MaterialMenu.prototype.Constant_ = {
    // Total duration of the menu animation.
    TRANSITION_DURATION_SECONDS: 0.3,
    // The fraction of the total duration we want to use for menu item animations.
    TRANSITION_DURATION_FRACTION: 0.8,
    // How long the menu stays open after choosing an option (so the user can see
    // the ripple).
    CLOSE_TIMEOUT: 150
};
/**
   * Keycodes, for code readability.
   *
   * @enum {Number}
   * @private
   */
MaterialMenu.prototype.Keycodes_ = {
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    UP_ARROW: 38,
    DOWN_ARROW: 40
};
/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {String}
   * @private
   */
MaterialMenu.prototype.CssClasses_ = {
    CONTAINER: 'mdl-menu__container',
    OUTLINE: 'mdl-menu__outline',
    ITEM: 'mdl-menu__item',
    ITEM_RIPPLE_CONTAINER: 'mdl-menu__item-ripple-container',
    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
    RIPPLE: 'mdl-ripple',
    // Statuses
    IS_UPGRADED: 'is-upgraded',
    IS_VISIBLE: 'is-visible',
    IS_ANIMATING: 'is-animating',
    // Alignment options
    BOTTOM_LEFT: 'mdl-menu--bottom-left',
    // This is the default.
    BOTTOM_RIGHT: 'mdl-menu--bottom-right',
    TOP_LEFT: 'mdl-menu--top-left',
    TOP_RIGHT: 'mdl-menu--top-right',
    UNALIGNED: 'mdl-menu--unaligned'
};
/**
   * Initialize element.
   */
MaterialMenu.prototype.init = function () {
    if (this.element_) {
        // Create container for the menu.
        var container = document.createElement('div');
        container.classList.add(this.CssClasses_.CONTAINER);
        this.element_.parentElement.insertBefore(container, this.element_);
        this.element_.parentElement.removeChild(this.element_);
        container.appendChild(this.element_);
        this.container_ = container;
        // Create outline for the menu (shadow and background).
        var outline = document.createElement('div');
        outline.classList.add(this.CssClasses_.OUTLINE);
        this.outline_ = outline;
        container.insertBefore(outline, this.element_);
        // Find the "for" element and bind events to it.
        var forElId = this.element_.getAttribute('for');
        var forEl = null;
        if (forElId) {
            forEl = document.getElementById(forElId);
            if (forEl) {
                this.forElement_ = forEl;
                forEl.addEventListener('click', this.handleForClick_.bind(this));
                forEl.addEventListener('keydown', this.handleForKeyboardEvent_.bind(this));
            }
        }
        var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
        this.boundItemKeydown = this.handleItemKeyboardEvent_.bind(this);
        this.boundItemClick = this.handleItemClick_.bind(this);
        for (var i = 0; i < items.length; i++) {
            // Add a listener to each menu item.
            items[i].addEventListener('click', this.boundItemClick);
            // Add a tab index to each menu item.
            items[i].tabIndex = '-1';
            // Add a keyboard listener to each menu item.
            items[i].addEventListener('keydown', this.boundItemKeydown);
        }
        // Add ripple classes to each item, if the user has enabled ripples.
        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
            this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
            for (i = 0; i < items.length; i++) {
                var item = items[i];
                var rippleContainer = document.createElement('span');
                rippleContainer.classList.add(this.CssClasses_.ITEM_RIPPLE_CONTAINER);
                var ripple = document.createElement('span');
                ripple.classList.add(this.CssClasses_.RIPPLE);
                rippleContainer.appendChild(ripple);
                item.appendChild(rippleContainer);
                item.classList.add(this.CssClasses_.RIPPLE_EFFECT);
            }
        }
        // Copy alignment classes to the container, so the outline can use them.
        if (this.element_.classList.contains(this.CssClasses_.BOTTOM_LEFT)) {
            this.outline_.classList.add(this.CssClasses_.BOTTOM_LEFT);
        }
        if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
            this.outline_.classList.add(this.CssClasses_.BOTTOM_RIGHT);
        }
        if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
            this.outline_.classList.add(this.CssClasses_.TOP_LEFT);
        }
        if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
            this.outline_.classList.add(this.CssClasses_.TOP_RIGHT);
        }
        if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
            this.outline_.classList.add(this.CssClasses_.UNALIGNED);
        }
        container.classList.add(this.CssClasses_.IS_UPGRADED);
    }
};
/**
   * Handles a click on the "for" element, by positioning the menu and then
   * toggling it.
   *
   * @param {Event} evt The event that fired.
   * @private
   */
MaterialMenu.prototype.handleForClick_ = function (evt) {
    if (this.element_ && this.forElement_) {
        var rect = this.forElement_.getBoundingClientRect();
        var forRect = this.forElement_.parentElement.getBoundingClientRect();
        if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
        } else if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
            // Position below the "for" element, aligned to its right.
            this.container_.style.right = forRect.right - rect.right + 'px';
            this.container_.style.top = this.forElement_.offsetTop + this.forElement_.offsetHeight + 'px';
        } else if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
            // Position above the "for" element, aligned to its left.
            this.container_.style.left = this.forElement_.offsetLeft + 'px';
            this.container_.style.bottom = forRect.bottom - rect.top + 'px';
        } else if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
            // Position above the "for" element, aligned to its right.
            this.container_.style.right = forRect.right - rect.right + 'px';
            this.container_.style.bottom = forRect.bottom - rect.top + 'px';
        } else {
            // Default: position below the "for" element, aligned to its left.
            this.container_.style.left = this.forElement_.offsetLeft + 'px';
            this.container_.style.top = this.forElement_.offsetTop + this.forElement_.offsetHeight + 'px';
        }
    }
    this.toggle(evt);
};
/**
   * Handles a keyboard event on the "for" element.
   *
   * @param {Event} evt The event that fired.
   * @private
   */
MaterialMenu.prototype.handleForKeyboardEvent_ = function (evt) {
    if (this.element_ && this.container_ && this.forElement_) {
        var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM + ':not([disabled])');
        if (items && items.length > 0 && this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
            if (evt.keyCode === this.Keycodes_.UP_ARROW) {
                evt.preventDefault();
                items[items.length - 1].focus();
            } else if (evt.keyCode === this.Keycodes_.DOWN_ARROW) {
                evt.preventDefault();
                items[0].focus();
            }
        }
    }
};
/**
   * Handles a keyboard event on an item.
   *
   * @param {Event} evt The event that fired.
   * @private
   */
MaterialMenu.prototype.handleItemKeyboardEvent_ = function (evt) {
    if (this.element_ && this.container_) {
        var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM + ':not([disabled])');
        if (items && items.length > 0 && this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
            var currentIndex = Array.prototype.slice.call(items).indexOf(evt.target);
            if (evt.keyCode === this.Keycodes_.UP_ARROW) {
                evt.preventDefault();
                if (currentIndex > 0) {
                    items[currentIndex - 1].focus();
                } else {
                    items[items.length - 1].focus();
                }
            } else if (evt.keyCode === this.Keycodes_.DOWN_ARROW) {
                evt.preventDefault();
                if (items.length > currentIndex + 1) {
                    items[currentIndex + 1].focus();
                } else {
                    items[0].focus();
                }
            } else if (evt.keyCode === this.Keycodes_.SPACE || evt.keyCode === this.Keycodes_.ENTER) {
                evt.preventDefault();
                // Send mousedown and mouseup to trigger ripple.
                var e = new MouseEvent('mousedown');
                evt.target.dispatchEvent(e);
                e = new MouseEvent('mouseup');
                evt.target.dispatchEvent(e);
                // Send click.
                evt.target.click();
            } else if (evt.keyCode === this.Keycodes_.ESCAPE) {
                evt.preventDefault();
                this.hide();
            }
        }
    }
};
/**
   * Handles a click event on an item.
   *
   * @param {Event} evt The event that fired.
   * @private
   */
MaterialMenu.prototype.handleItemClick_ = function (evt) {
    if (evt.target.getAttribute('disabled') !== null) {
        evt.stopPropagation();
    } else {
        // Wait some time before closing menu, so the user can see the ripple.
        this.closing_ = true;
        window.setTimeout(function (evt) {
            this.hide();
            this.closing_ = false;
        }.bind(this), this.Constant_.CLOSE_TIMEOUT);
    }
};
/**
   * Calculates the initial clip (for opening the menu) or final clip (for closing
   * it), and applies it. This allows us to animate from or to the correct point,
   * that is, the point it's aligned to in the "for" element.
   *
   * @param {Number} height Height of the clip rectangle
   * @param {Number} width Width of the clip rectangle
   * @private
   */
MaterialMenu.prototype.applyClip_ = function (height, width) {
    if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
        // Do not clip.
        this.element_.style.clip = null;
    } else if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
        // Clip to the top right corner of the menu.
        this.element_.style.clip = 'rect(0 ' + width + 'px ' + '0 ' + width + 'px)';
    } else if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
        // Clip to the bottom left corner of the menu.
        this.element_.style.clip = 'rect(' + height + 'px 0 ' + height + 'px 0)';
    } else if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
        // Clip to the bottom right corner of the menu.
        this.element_.style.clip = 'rect(' + height + 'px ' + width + 'px ' + height + 'px ' + width + 'px)';
    } else {
        // Default: do not clip (same as clipping to the top left corner).
        this.element_.style.clip = null;
    }
};
/**
   * Adds an event listener to clean up after the animation ends.
   *
   * @private
   */
MaterialMenu.prototype.addAnimationEndListener_ = function () {
    var cleanup = function () {
        this.element_.removeEventListener('transitionend', cleanup);
        this.element_.removeEventListener('webkitTransitionEnd', cleanup);
        this.element_.classList.remove(this.CssClasses_.IS_ANIMATING);
    }.bind(this);
    // Remove animation class once the transition is done.
    this.element_.addEventListener('transitionend', cleanup);
    this.element_.addEventListener('webkitTransitionEnd', cleanup);
};
/**
   * Displays the menu.
   *
   * @public
   */
MaterialMenu.prototype.show = function (evt) {
    if (this.element_ && this.container_ && this.outline_) {
        // Measure the inner element.
        var height = this.element_.getBoundingClientRect().height;
        var width = this.element_.getBoundingClientRect().width;
        // Apply the inner element's size to the container and outline.
        this.container_.style.width = width + 'px';
        this.container_.style.height = height + 'px';
        this.outline_.style.width = width + 'px';
        this.outline_.style.height = height + 'px';
        var transitionDuration = this.Constant_.TRANSITION_DURATION_SECONDS * this.Constant_.TRANSITION_DURATION_FRACTION;
        // Calculate transition delays for individual menu items, so that they fade
        // in one at a time.
        var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
        for (var i = 0; i < items.length; i++) {
            var itemDelay = null;
            if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT) || this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
                itemDelay = (height - items[i].offsetTop - items[i].offsetHeight) / height * transitionDuration + 's';
            } else {
                itemDelay = items[i].offsetTop / height * transitionDuration + 's';
            }
            items[i].style.transitionDelay = itemDelay;
        }
        // Apply the initial clip to the text before we start animating.
        this.applyClip_(height, width);
        // Wait for the next frame, turn on animation, and apply the final clip.
        // Also make it visible. This triggers the transitions.
        window.requestAnimationFrame(function () {
            this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
            this.element_.style.clip = 'rect(0 ' + width + 'px ' + height + 'px 0)';
            this.container_.classList.add(this.CssClasses_.IS_VISIBLE);
        }.bind(this));
        // Clean up after the animation is complete.
        this.addAnimationEndListener_();
        // Add a click listener to the document, to close the menu.
        var callback = function (e) {
            // Check to see if the document is processing the same event that
            // displayed the menu in the first place. If so, do nothing.
            // Also check to see if the menu is in the process of closing itself, and
            // do nothing in that case.
            if (e !== evt && !this.closing_) {
                document.removeEventListener('click', callback);
                this.hide();
            }
        }.bind(this);
        document.addEventListener('click', callback);
    }
};
/**
   * Hides the menu.
   *
   * @public
   */
MaterialMenu.prototype.hide = function () {
    if (this.element_ && this.container_ && this.outline_) {
        var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
        // Remove all transition delays; menu items fade out concurrently.
        for (var i = 0; i < items.length; i++) {
            items[i].style.transitionDelay = null;
        }
        // Measure the inner element.
        var height = this.element_.getBoundingClientRect().height;
        var width = this.element_.getBoundingClientRect().width;
        // Turn on animation, and apply the final clip. Also make invisible.
        // This triggers the transitions.
        this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
        this.applyClip_(height, width);
        this.container_.classList.remove(this.CssClasses_.IS_VISIBLE);
        // Clean up after the animation is complete.
        this.addAnimationEndListener_();
    }
};
/**
   * Displays or hides the menu, depending on current state.
   *
   * @public
   */
MaterialMenu.prototype.toggle = function (evt) {
    if (this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
        this.hide();
    } else {
        this.show(evt);
    }
};
/**
   * Downgrade the component.
   *
   * @private
   */
MaterialMenu.prototype.mdlDowngrade_ = function () {
    var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
    for (var i = 0; i < items.length; i++) {
        items[i].removeEventListener('click', this.boundItemClick);
        items[i].removeEventListener('keydown', this.boundItemKeydown);
    }
};
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialMenu,
    classAsString: 'MaterialMenu',
    cssClass: 'mdl-js-menu',
    widget: true
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Progress MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @param {HTMLElement} element The element that will be upgraded.
   */
var MaterialProgress = function MaterialProgress(element) {
    this.element_ = element;
    // Initialize instance.
    this.init();
};
window.MaterialProgress = MaterialProgress;
/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {String | Number}
   * @private
   */
MaterialProgress.prototype.Constant_ = {};
/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {String}
   * @private
   */
MaterialProgress.prototype.CssClasses_ = { INDETERMINATE_CLASS: 'mdl-progress__indeterminate' };
/**
   * Set the current progress of the progressbar.
   *
   * @param {Number} p Percentage of the progress (0-100)
   * @public
   */
MaterialProgress.prototype.setProgress = function (p) {
    if (this.element_.classList.contains(this.CssClasses_.INDETERMINATE_CLASS)) {
        return;
    }
    this.progressbar_.style.width = p + '%';
};
/**
   * Set the current progress of the buffer.
   *
   * @param {Number} p Percentage of the buffer (0-100)
   * @public
   */
MaterialProgress.prototype.setBuffer = function (p) {
    this.bufferbar_.style.width = p + '%';
    this.auxbar_.style.width = 100 - p + '%';
};
/**
   * Initialize element.
   */
MaterialProgress.prototype.init = function () {
    if (this.element_) {
        var el = document.createElement('div');
        el.className = 'progressbar bar bar1';
        this.element_.appendChild(el);
        this.progressbar_ = el;
        el = document.createElement('div');
        el.className = 'bufferbar bar bar2';
        this.element_.appendChild(el);
        this.bufferbar_ = el;
        el = document.createElement('div');
        el.className = 'auxbar bar bar3';
        this.element_.appendChild(el);
        this.auxbar_ = el;
        this.progressbar_.style.width = '0%';
        this.bufferbar_.style.width = '100%';
        this.auxbar_.style.width = '0%';
        this.element_.classList.add('is-upgraded');
    }
};
/**
   * Downgrade the component
   *
   * @private
   */
MaterialProgress.prototype.mdlDowngrade_ = function () {
    while (this.element_.firstChild) {
        this.element_.removeChild(this.element_.firstChild);
    }
};
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialProgress,
    classAsString: 'MaterialProgress',
    cssClass: 'mdl-js-progress',
    widget: true
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Radio MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @param {HTMLElement} element The element that will be upgraded.
   */
var MaterialRadio = function MaterialRadio(element) {
    this.element_ = element;
    // Initialize instance.
    this.init();
};
window.MaterialRadio = MaterialRadio;
/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {String | Number}
   * @private
   */
MaterialRadio.prototype.Constant_ = { TINY_TIMEOUT: 0.001 };
/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {String}
   * @private
   */
MaterialRadio.prototype.CssClasses_ = {
    IS_FOCUSED: 'is-focused',
    IS_DISABLED: 'is-disabled',
    IS_CHECKED: 'is-checked',
    IS_UPGRADED: 'is-upgraded',
    JS_RADIO: 'mdl-js-radio',
    RADIO_BTN: 'mdl-radio__button',
    RADIO_OUTER_CIRCLE: 'mdl-radio__outer-circle',
    RADIO_INNER_CIRCLE: 'mdl-radio__inner-circle',
    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
    RIPPLE_CONTAINER: 'mdl-radio__ripple-container',
    RIPPLE_CENTER: 'mdl-ripple--center',
    RIPPLE: 'mdl-ripple'
};
/**
   * Handle change of state.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialRadio.prototype.onChange_ = function (event) {
    // Since other radio buttons don't get change events, we need to look for
    // them to update their classes.
    var radios = document.getElementsByClassName(this.CssClasses_.JS_RADIO);
    for (var i = 0; i < radios.length; i++) {
        var button = radios[i].querySelector('.' + this.CssClasses_.RADIO_BTN);
        // Different name == different group, so no point updating those.
        if (button.getAttribute('name') === this.btnElement_.getAttribute('name')) {
            radios[i].MaterialRadio.updateClasses_();
        }
    }
};
/**
   * Handle focus.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialRadio.prototype.onFocus_ = function (event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
};
/**
   * Handle lost focus.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialRadio.prototype.onBlur_ = function (event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
};
/**
   * Handle mouseup.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialRadio.prototype.onMouseup_ = function (event) {
    this.blur_();
};
/**
   * Update classes.
   *
   * @private
   */
MaterialRadio.prototype.updateClasses_ = function () {
    this.checkDisabled();
    this.checkToggleState();
};
/**
   * Add blur.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialRadio.prototype.blur_ = function (event) {
    // TODO: figure out why there's a focus event being fired after our blur,
    // so that we can avoid this hack.
    window.setTimeout(function () {
        this.btnElement_.blur();
    }.bind(this), this.Constant_.TINY_TIMEOUT);
};
// Public methods.
/**
   * Check the components disabled state.
   *
   * @public
   */
MaterialRadio.prototype.checkDisabled = function () {
    if (this.btnElement_.disabled) {
        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
};
/**
   * Check the components toggled state.
   *
   * @public
   */
MaterialRadio.prototype.checkToggleState = function () {
    if (this.btnElement_.checked) {
        this.element_.classList.add(this.CssClasses_.IS_CHECKED);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
    }
};
/**
   * Disable radio.
   *
   * @public
   */
MaterialRadio.prototype.disable = function () {
    this.btnElement_.disabled = true;
    this.updateClasses_();
};
/**
   * Enable radio.
   *
   * @public
   */
MaterialRadio.prototype.enable = function () {
    this.btnElement_.disabled = false;
    this.updateClasses_();
};
/**
   * Check radio.
   *
   * @public
   */
MaterialRadio.prototype.check = function () {
    this.btnElement_.checked = true;
    this.updateClasses_();
};
/**
   * Uncheck radio.
   *
   * @public
   */
MaterialRadio.prototype.uncheck = function () {
    this.btnElement_.checked = false;
    this.updateClasses_();
};
/**
   * Initialize element.
   */
MaterialRadio.prototype.init = function () {
    if (this.element_) {
        this.btnElement_ = this.element_.querySelector('.' + this.CssClasses_.RADIO_BTN);
        var outerCircle = document.createElement('span');
        outerCircle.classList.add(this.CssClasses_.RADIO_OUTER_CIRCLE);
        var innerCircle = document.createElement('span');
        innerCircle.classList.add(this.CssClasses_.RADIO_INNER_CIRCLE);
        this.element_.appendChild(outerCircle);
        this.element_.appendChild(innerCircle);
        var rippleContainer;
        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
            this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
            rippleContainer = document.createElement('span');
            rippleContainer.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
            rippleContainer.classList.add(this.CssClasses_.RIPPLE_EFFECT);
            rippleContainer.classList.add(this.CssClasses_.RIPPLE_CENTER);
            rippleContainer.addEventListener('mouseup', this.onMouseup_.bind(this));
            var ripple = document.createElement('span');
            ripple.classList.add(this.CssClasses_.RIPPLE);
            rippleContainer.appendChild(ripple);
            this.element_.appendChild(rippleContainer);
        }
        this.btnElement_.addEventListener('change', this.onChange_.bind(this));
        this.btnElement_.addEventListener('focus', this.onFocus_.bind(this));
        this.btnElement_.addEventListener('blur', this.onBlur_.bind(this));
        this.element_.addEventListener('mouseup', this.onMouseup_.bind(this));
        this.updateClasses_();
        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
};
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialRadio,
    classAsString: 'MaterialRadio',
    cssClass: 'mdl-js-radio',
    widget: true
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Slider MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @param {HTMLElement} element The element that will be upgraded.
   */
var MaterialSlider = function MaterialSlider(element) {
    this.element_ = element;
    // Browser feature detection.
    this.isIE_ = window.navigator.msPointerEnabled;
    // Initialize instance.
    this.init();
};
window.MaterialSlider = MaterialSlider;
/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {String | Number}
   * @private
   */
MaterialSlider.prototype.Constant_ = {};
/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {String}
   * @private
   */
MaterialSlider.prototype.CssClasses_ = {
    IE_CONTAINER: 'mdl-slider__ie-container',
    SLIDER_CONTAINER: 'mdl-slider__container',
    BACKGROUND_FLEX: 'mdl-slider__background-flex',
    BACKGROUND_LOWER: 'mdl-slider__background-lower',
    BACKGROUND_UPPER: 'mdl-slider__background-upper',
    IS_LOWEST_VALUE: 'is-lowest-value',
    IS_UPGRADED: 'is-upgraded'
};
/**
   * Handle input on element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialSlider.prototype.onInput_ = function (event) {
    this.updateValueStyles_();
};
/**
   * Handle change on element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialSlider.prototype.onChange_ = function (event) {
    this.updateValueStyles_();
};
/**
   * Handle mouseup on element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialSlider.prototype.onMouseUp_ = function (event) {
    event.target.blur();
};
/**
   * Handle mousedown on container element.
   * This handler is purpose is to not require the use to click
   * exactly on the 2px slider element, as FireFox seems to be very
   * strict about this.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialSlider.prototype.onContainerMouseDown_ = function (event) {
    // If this click is not on the parent element (but rather some child)
    // ignore. It may still bubble up.
    if (event.target !== this.element_.parentElement) {
        return;
    }
    // Discard the original event and create a new event that
    // is on the slider element.
    event.preventDefault();
    var newEvent = new MouseEvent('mousedown', {
        target: event.target,
        buttons: event.buttons,
        clientX: event.clientX,
        clientY: this.element_.getBoundingClientRect().y
    });
    this.element_.dispatchEvent(newEvent);
};
/**
   * Handle updating of values.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialSlider.prototype.updateValueStyles_ = function (event) {
    // Calculate and apply percentages to div structure behind slider.
    var fraction = (this.element_.value - this.element_.min) / (this.element_.max - this.element_.min);
    if (fraction === 0) {
        this.element_.classList.add(this.CssClasses_.IS_LOWEST_VALUE);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_LOWEST_VALUE);
    }
    if (!this.isIE_) {
        this.backgroundLower_.style.flex = fraction;
        this.backgroundLower_.style.webkitFlex = fraction;
        this.backgroundUpper_.style.flex = 1 - fraction;
        this.backgroundUpper_.style.webkitFlex = 1 - fraction;
    }
};
// Public methods.
/**
   * Disable slider.
   *
   * @public
   */
MaterialSlider.prototype.disable = function () {
    this.element_.disabled = true;
};
/**
   * Enable slider.
   *
   * @public
   */
MaterialSlider.prototype.enable = function () {
    this.element_.disabled = false;
};
/**
   * Update slider value.
   *
   * @param {Number} value The value to which to set the control (optional).
   * @public
   */
MaterialSlider.prototype.change = function (value) {
    if (typeof value !== 'undefined') {
        this.element_.value = value;
    }
    this.updateValueStyles_();
};
/**
   * Initialize element.
   */
MaterialSlider.prototype.init = function () {
    if (this.element_) {
        if (this.isIE_) {
            // Since we need to specify a very large height in IE due to
            // implementation limitations, we add a parent here that trims it down to
            // a reasonable size.
            var containerIE = document.createElement('div');
            containerIE.classList.add(this.CssClasses_.IE_CONTAINER);
            this.element_.parentElement.insertBefore(containerIE, this.element_);
            this.element_.parentElement.removeChild(this.element_);
            containerIE.appendChild(this.element_);
        } else {
            // For non-IE browsers, we need a div structure that sits behind the
            // slider and allows us to style the left and right sides of it with
            // different colors.
            var container = document.createElement('div');
            container.classList.add(this.CssClasses_.SLIDER_CONTAINER);
            this.element_.parentElement.insertBefore(container, this.element_);
            this.element_.parentElement.removeChild(this.element_);
            container.appendChild(this.element_);
            var backgroundFlex = document.createElement('div');
            backgroundFlex.classList.add(this.CssClasses_.BACKGROUND_FLEX);
            container.appendChild(backgroundFlex);
            this.backgroundLower_ = document.createElement('div');
            this.backgroundLower_.classList.add(this.CssClasses_.BACKGROUND_LOWER);
            backgroundFlex.appendChild(this.backgroundLower_);
            this.backgroundUpper_ = document.createElement('div');
            this.backgroundUpper_.classList.add(this.CssClasses_.BACKGROUND_UPPER);
            backgroundFlex.appendChild(this.backgroundUpper_);
        }
        this.boundInputHandler = this.onInput_.bind(this);
        this.boundChangeHandler = this.onChange_.bind(this);
        this.boundMouseUpHandler = this.onMouseUp_.bind(this);
        this.boundContainerMouseDownHandler = this.onContainerMouseDown_.bind(this);
        this.element_.addEventListener('input', this.boundInputHandler);
        this.element_.addEventListener('change', this.boundChangeHandler);
        this.element_.addEventListener('mouseup', this.boundMouseUpHandler);
        this.element_.parentElement.addEventListener('mousedown', this.boundContainerMouseDownHandler);
        this.updateValueStyles_();
        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
};
/**
   * Downgrade the component
   *
   * @private
   */
MaterialSlider.prototype.mdlDowngrade_ = function () {
    this.element_.removeEventListener('input', this.boundInputHandler);
    this.element_.removeEventListener('change', this.boundChangeHandler);
    this.element_.removeEventListener('mouseup', this.boundMouseUpHandler);
    this.element_.parentElement.removeEventListener('mousedown', this.boundContainerMouseDownHandler);
};
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialSlider,
    classAsString: 'MaterialSlider',
    cssClass: 'mdl-js-slider',
    widget: true
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Spinner MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @param {HTMLElement} element The element that will be upgraded.
   * @constructor
   */
var MaterialSpinner = function MaterialSpinner(element) {
    this.element_ = element;
    // Initialize instance.
    this.init();
};
window.MaterialSpinner = MaterialSpinner;
/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {String | Number}
   * @private
   */
MaterialSpinner.prototype.Constant_ = { MDL_SPINNER_LAYER_COUNT: 4 };
/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {String}
   * @private
   */
MaterialSpinner.prototype.CssClasses_ = {
    MDL_SPINNER_LAYER: 'mdl-spinner__layer',
    MDL_SPINNER_CIRCLE_CLIPPER: 'mdl-spinner__circle-clipper',
    MDL_SPINNER_CIRCLE: 'mdl-spinner__circle',
    MDL_SPINNER_GAP_PATCH: 'mdl-spinner__gap-patch',
    MDL_SPINNER_LEFT: 'mdl-spinner__left',
    MDL_SPINNER_RIGHT: 'mdl-spinner__right'
};
/**
   * Auxiliary method to create a spinner layer.
   *
   * @param {Number} index Index of the layer to be created.
   * @public
   */
MaterialSpinner.prototype.createLayer = function (index) {
    var layer = document.createElement('div');
    layer.classList.add(this.CssClasses_.MDL_SPINNER_LAYER);
    layer.classList.add(this.CssClasses_.MDL_SPINNER_LAYER + '-' + index);
    var leftClipper = document.createElement('div');
    leftClipper.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER);
    leftClipper.classList.add(this.CssClasses_.MDL_SPINNER_LEFT);
    var gapPatch = document.createElement('div');
    gapPatch.classList.add(this.CssClasses_.MDL_SPINNER_GAP_PATCH);
    var rightClipper = document.createElement('div');
    rightClipper.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER);
    rightClipper.classList.add(this.CssClasses_.MDL_SPINNER_RIGHT);
    var circleOwners = [
        leftClipper,
        gapPatch,
        rightClipper
    ];
    for (var i = 0; i < circleOwners.length; i++) {
        var circle = document.createElement('div');
        circle.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE);
        circleOwners[i].appendChild(circle);
    }
    layer.appendChild(leftClipper);
    layer.appendChild(gapPatch);
    layer.appendChild(rightClipper);
    this.element_.appendChild(layer);
};
/**
   * Stops the spinner animation.
   * Public method for users who need to stop the spinner for any reason.
   *
   * @public
   */
MaterialSpinner.prototype.stop = function () {
    this.element_.classList.remove('is-active');
};
/**
   * Starts the spinner animation.
   * Public method for users who need to manually start the spinner for any reason
   * (instead of just adding the 'is-active' class to their markup).
   *
   * @public
   */
MaterialSpinner.prototype.start = function () {
    this.element_.classList.add('is-active');
};
/**
   * Initialize element.
   */
MaterialSpinner.prototype.init = function () {
    if (this.element_) {
        for (var i = 1; i <= this.Constant_.MDL_SPINNER_LAYER_COUNT; i++) {
            this.createLayer(i);
        }
        this.element_.classList.add('is-upgraded');
    }
};
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialSpinner,
    classAsString: 'MaterialSpinner',
    cssClass: 'mdl-js-spinner',
    widget: true
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Checkbox MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @param {HTMLElement} element The element that will be upgraded.
   */
var MaterialSwitch = function MaterialSwitch(element) {
    this.element_ = element;
    // Initialize instance.
    this.init();
};
window.MaterialSwitch = MaterialSwitch;
/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {String | Number}
   * @private
   */
MaterialSwitch.prototype.Constant_ = { TINY_TIMEOUT: 0.001 };
/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {String}
   * @private
   */
MaterialSwitch.prototype.CssClasses_ = {
    INPUT: 'mdl-switch__input',
    TRACK: 'mdl-switch__track',
    THUMB: 'mdl-switch__thumb',
    FOCUS_HELPER: 'mdl-switch__focus-helper',
    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
    RIPPLE_CONTAINER: 'mdl-switch__ripple-container',
    RIPPLE_CENTER: 'mdl-ripple--center',
    RIPPLE: 'mdl-ripple',
    IS_FOCUSED: 'is-focused',
    IS_DISABLED: 'is-disabled',
    IS_CHECKED: 'is-checked'
};
/**
   * Handle change of state.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialSwitch.prototype.onChange_ = function (event) {
    this.updateClasses_();
};
/**
   * Handle focus of element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialSwitch.prototype.onFocus_ = function (event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
};
/**
   * Handle lost focus of element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialSwitch.prototype.onBlur_ = function (event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
};
/**
   * Handle mouseup.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialSwitch.prototype.onMouseUp_ = function (event) {
    this.blur_();
};
/**
   * Handle class updates.
   *
   * @private
   */
MaterialSwitch.prototype.updateClasses_ = function () {
    this.checkDisabled();
    this.checkToggleState();
};
/**
   * Add blur.
   *
   * @private
   */
MaterialSwitch.prototype.blur_ = function (event) {
    // TODO: figure out why there's a focus event being fired after our blur,
    // so that we can avoid this hack.
    window.setTimeout(function () {
        this.inputElement_.blur();
    }.bind(this), this.Constant_.TINY_TIMEOUT);
};
// Public methods.
/**
   * Check the components disabled state.
   *
   * @public
   */
MaterialSwitch.prototype.checkDisabled = function () {
    if (this.inputElement_.disabled) {
        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
};
/**
   * Check the components toggled state.
   *
   * @public
   */
MaterialSwitch.prototype.checkToggleState = function () {
    if (this.inputElement_.checked) {
        this.element_.classList.add(this.CssClasses_.IS_CHECKED);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
    }
};
/**
   * Disable switch.
   *
   * @public
   */
MaterialSwitch.prototype.disable = function () {
    this.inputElement_.disabled = true;
    this.updateClasses_();
};
/**
   * Enable switch.
   *
   * @public
   */
MaterialSwitch.prototype.enable = function () {
    this.inputElement_.disabled = false;
    this.updateClasses_();
};
/**
   * Activate switch.
   *
   * @public
   */
MaterialSwitch.prototype.on = function () {
    this.inputElement_.checked = true;
    this.updateClasses_();
};
/**
   * Deactivate switch.
   *
   * @public
   */
MaterialSwitch.prototype.off = function () {
    this.inputElement_.checked = false;
    this.updateClasses_();
};
/**
   * Initialize element.
   */
MaterialSwitch.prototype.init = function () {
    if (this.element_) {
        this.inputElement_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);
        var track = document.createElement('div');
        track.classList.add(this.CssClasses_.TRACK);
        var thumb = document.createElement('div');
        thumb.classList.add(this.CssClasses_.THUMB);
        var focusHelper = document.createElement('span');
        focusHelper.classList.add(this.CssClasses_.FOCUS_HELPER);
        thumb.appendChild(focusHelper);
        this.element_.appendChild(track);
        this.element_.appendChild(thumb);
        this.boundMouseUpHandler = this.onMouseUp_.bind(this);
        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
            this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
            this.rippleContainerElement_ = document.createElement('span');
            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_EFFECT);
            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER);
            this.rippleContainerElement_.addEventListener('mouseup', this.boundMouseUpHandler);
            var ripple = document.createElement('span');
            ripple.classList.add(this.CssClasses_.RIPPLE);
            this.rippleContainerElement_.appendChild(ripple);
            this.element_.appendChild(this.rippleContainerElement_);
        }
        this.boundChangeHandler = this.onChange_.bind(this);
        this.boundFocusHandler = this.onFocus_.bind(this);
        this.boundBlurHandler = this.onBlur_.bind(this);
        this.inputElement_.addEventListener('change', this.boundChangeHandler);
        this.inputElement_.addEventListener('focus', this.boundFocusHandler);
        this.inputElement_.addEventListener('blur', this.boundBlurHandler);
        this.element_.addEventListener('mouseup', this.boundMouseUpHandler);
        this.updateClasses_();
        this.element_.classList.add('is-upgraded');
    }
};
/**
   * Downgrade the component.
   *
   * @private
   */
MaterialSwitch.prototype.mdlDowngrade_ = function () {
    if (this.rippleContainerElement_) {
        this.rippleContainerElement_.removeEventListener('mouseup', this.boundMouseUpHandler);
    }
    this.inputElement_.removeEventListener('change', this.boundChangeHandler);
    this.inputElement_.removeEventListener('focus', this.boundFocusHandler);
    this.inputElement_.removeEventListener('blur', this.boundBlurHandler);
    this.element_.removeEventListener('mouseup', this.boundMouseUpHandler);
};
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialSwitch,
    classAsString: 'MaterialSwitch',
    cssClass: 'mdl-js-switch',
    widget: true
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Tabs MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @param {HTMLElement} element The element that will be upgraded.
   */
var MaterialTabs = function MaterialTabs(element) {
    // Stores the HTML element.
    this.element_ = element;
    // Initialize instance.
    this.init();
};
window.MaterialTabs = MaterialTabs;
/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {String}
   * @private
   */
MaterialTabs.prototype.Constant_ = {};
/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {String}
   * @private
   */
MaterialTabs.prototype.CssClasses_ = {
    TAB_CLASS: 'mdl-tabs__tab',
    PANEL_CLASS: 'mdl-tabs__panel',
    ACTIVE_CLASS: 'is-active',
    UPGRADED_CLASS: 'is-upgraded',
    MDL_JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
    MDL_RIPPLE_CONTAINER: 'mdl-tabs__ripple-container',
    MDL_RIPPLE: 'mdl-ripple',
    MDL_JS_RIPPLE_EFFECT_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events'
};
/**
   * Handle clicks to a tabs component
   *
   * @private
   */
MaterialTabs.prototype.initTabs_ = function () {
    if (this.element_.classList.contains(this.CssClasses_.MDL_JS_RIPPLE_EFFECT)) {
        this.element_.classList.add(this.CssClasses_.MDL_JS_RIPPLE_EFFECT_IGNORE_EVENTS);
    }
    // Select element tabs, document panels
    this.tabs_ = this.element_.querySelectorAll('.' + this.CssClasses_.TAB_CLASS);
    this.panels_ = this.element_.querySelectorAll('.' + this.CssClasses_.PANEL_CLASS);
    // Create new tabs for each tab element
    for (var i = 0; i < this.tabs_.length; i++) {
        new MaterialTab(this.tabs_[i], this);
    }
    this.element_.classList.add(this.CssClasses_.UPGRADED_CLASS);
};
/**
   * Reset tab state, dropping active classes
   *
   * @private
   */
MaterialTabs.prototype.resetTabState_ = function () {
    for (var k = 0; k < this.tabs_.length; k++) {
        this.tabs_[k].classList.remove(this.CssClasses_.ACTIVE_CLASS);
    }
};
/**
   * Reset panel state, droping active classes
   *
   * @private
   */
MaterialTabs.prototype.resetPanelState_ = function () {
    for (var j = 0; j < this.panels_.length; j++) {
        this.panels_[j].classList.remove(this.CssClasses_.ACTIVE_CLASS);
    }
};
/**
   * Initialize element.
   */
MaterialTabs.prototype.init = function () {
    if (this.element_) {
        this.initTabs_();
    }
};
function MaterialTab(tab, ctx) {
    if (tab) {
        if (ctx.element_.classList.contains(ctx.CssClasses_.MDL_JS_RIPPLE_EFFECT)) {
            var rippleContainer = document.createElement('span');
            rippleContainer.classList.add(ctx.CssClasses_.MDL_RIPPLE_CONTAINER);
            rippleContainer.classList.add(ctx.CssClasses_.MDL_JS_RIPPLE_EFFECT);
            var ripple = document.createElement('span');
            ripple.classList.add(ctx.CssClasses_.MDL_RIPPLE);
            rippleContainer.appendChild(ripple);
            tab.appendChild(rippleContainer);
        }
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            var href = tab.href.split('#')[1];
            var panel = ctx.element_.querySelector('#' + href);
            ctx.resetTabState_();
            ctx.resetPanelState_();
            tab.classList.add(ctx.CssClasses_.ACTIVE_CLASS);
            panel.classList.add(ctx.CssClasses_.ACTIVE_CLASS);
        });
    }
}
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialTabs,
    classAsString: 'MaterialTabs',
    cssClass: 'mdl-js-tabs'
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Textfield MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @param {HTMLElement} element The element that will be upgraded.
   */
var MaterialTextfield = function MaterialTextfield(element) {
    this.element_ = element;
    this.maxRows = this.Constant_.NO_MAX_ROWS;
    // Initialize instance.
    this.init();
};
window.MaterialTextfield = MaterialTextfield;
/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {String | Number}
   * @private
   */
MaterialTextfield.prototype.Constant_ = {
    NO_MAX_ROWS: -1,
    MAX_ROWS_ATTRIBUTE: 'maxrows'
};
/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {String}
   * @private
   */
MaterialTextfield.prototype.CssClasses_ = {
    LABEL: 'mdl-textfield__label',
    INPUT: 'mdl-textfield__input',
    IS_DIRTY: 'is-dirty',
    IS_FOCUSED: 'is-focused',
    IS_DISABLED: 'is-disabled',
    IS_INVALID: 'is-invalid',
    IS_UPGRADED: 'is-upgraded'
};
/**
   * Handle input being entered.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialTextfield.prototype.onKeyDown_ = function (event) {
    var currentRowCount = event.target.value.split('\n').length;
    if (event.keyCode === 13) {
        if (currentRowCount >= this.maxRows) {
            event.preventDefault();
        }
    }
};
/**
   * Handle focus.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialTextfield.prototype.onFocus_ = function (event) {
    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
};
/**
   * Handle lost focus.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialTextfield.prototype.onBlur_ = function (event) {
    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
};
/**
   * Handle class updates.
   *
   * @private
   */
MaterialTextfield.prototype.updateClasses_ = function () {
    this.checkDisabled();
    this.checkValidity();
    this.checkDirty();
};
// Public methods.
/**
   * Check the disabled state and update field accordingly.
   *
   * @public
   */
MaterialTextfield.prototype.checkDisabled = function () {
    if (this.input_.disabled) {
        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
    }
};
/**
   * Check the validity state and update field accordingly.
   *
   * @public
   */
MaterialTextfield.prototype.checkValidity = function () {
    if (this.input_.validity.valid) {
        this.element_.classList.remove(this.CssClasses_.IS_INVALID);
    } else {
        this.element_.classList.add(this.CssClasses_.IS_INVALID);
    }
};
/**
   * Check the dirty state and update field accordingly.
   *
   * @public
   */
MaterialTextfield.prototype.checkDirty = function () {
    if (this.input_.value && this.input_.value.length > 0) {
        this.element_.classList.add(this.CssClasses_.IS_DIRTY);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_DIRTY);
    }
};
/**
   * Disable text field.
   *
   * @public
   */
MaterialTextfield.prototype.disable = function () {
    this.input_.disabled = true;
    this.updateClasses_();
};
/**
   * Enable text field.
   *
   * @public
   */
MaterialTextfield.prototype.enable = function () {
    this.input_.disabled = false;
    this.updateClasses_();
};
/**
   * Update text field value.
   *
   * @param {String} value The value to which to set the control (optional).
   * @public
   */
MaterialTextfield.prototype.change = function (value) {
    if (value) {
        this.input_.value = value;
    }
    this.updateClasses_();
};
/**
   * Initialize element.
   */
MaterialTextfield.prototype.init = function () {
    if (this.element_) {
        this.label_ = this.element_.querySelector('.' + this.CssClasses_.LABEL);
        this.input_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);
        if (this.input_) {
            if (this.input_.hasAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE)) {
                this.maxRows = parseInt(this.input_.getAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE), 10);
                if (isNaN(this.maxRows)) {
                    this.maxRows = this.Constant_.NO_MAX_ROWS;
                }
            }
            this.boundUpdateClassesHandler = this.updateClasses_.bind(this);
            this.boundFocusHandler = this.onFocus_.bind(this);
            this.boundBlurHandler = this.onBlur_.bind(this);
            this.input_.addEventListener('input', this.boundUpdateClassesHandler);
            this.input_.addEventListener('focus', this.boundFocusHandler);
            this.input_.addEventListener('blur', this.boundBlurHandler);
            if (this.maxRows !== this.Constant_.NO_MAX_ROWS) {
                // TODO: This should handle pasting multi line text.
                // Currently doesn't.
                this.boundKeyDownHandler = this.onKeyDown_.bind(this);
                this.input_.addEventListener('keydown', this.boundKeyDownHandler);
            }
            this.updateClasses_();
            this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
        }
    }
};
/**
   * Downgrade the component
   *
   * @private
   */
MaterialTextfield.prototype.mdlDowngrade_ = function () {
    this.input_.removeEventListener('input', this.boundUpdateClassesHandler);
    this.input_.removeEventListener('focus', this.boundFocusHandler);
    this.input_.removeEventListener('blur', this.boundBlurHandler);
    if (this.boundKeyDownHandler) {
        this.input_.removeEventListener('keydown', this.boundKeyDownHandler);
    }
};
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialTextfield,
    classAsString: 'MaterialTextfield',
    cssClass: 'mdl-js-textfield',
    widget: true
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Tooltip MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @param {HTMLElement} element The element that will be upgraded.
   */
var MaterialTooltip = function MaterialTooltip(element) {
    this.element_ = element;
    // Initialize instance.
    this.init();
};
window.MaterialTooltip = MaterialTooltip;
/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {String | Number}
   * @private
   */
MaterialTooltip.prototype.Constant_ = {};
/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {String}
   * @private
   */
MaterialTooltip.prototype.CssClasses_ = { IS_ACTIVE: 'is-active' };
/**
   * Handle mouseenter for tooltip.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialTooltip.prototype.handleMouseEnter_ = function (event) {
    event.stopPropagation();
    var props = event.target.getBoundingClientRect();
    var left = props.left + props.width / 2;
    var marginLeft = -1 * (this.element_.offsetWidth / 2);
    if (left + marginLeft < 0) {
        this.element_.style.left = 0;
        this.element_.style.marginLeft = 0;
    } else {
        this.element_.style.left = left + 'px';
        this.element_.style.marginLeft = marginLeft + 'px';
    }
    this.element_.style.top = props.top + props.height + 10 + 'px';
    this.element_.classList.add(this.CssClasses_.IS_ACTIVE);
    window.addEventListener('scroll', this.boundMouseLeaveHandler, false);
    window.addEventListener('touchmove', this.boundMouseLeaveHandler, false);
};
/**
   * Handle mouseleave for tooltip.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialTooltip.prototype.handleMouseLeave_ = function (event) {
    event.stopPropagation();
    this.element_.classList.remove(this.CssClasses_.IS_ACTIVE);
    window.removeEventListener('scroll', this.boundMouseLeaveHandler);
    window.removeEventListener('touchmove', this.boundMouseLeaveHandler, false);
};
/**
   * Initialize element.
   */
MaterialTooltip.prototype.init = function () {
    if (this.element_) {
        var forElId = this.element_.getAttribute('for');
        if (forElId) {
            this.forElement_ = document.getElementById(forElId);
        }
        if (this.forElement_) {
            // Tabindex needs to be set for `blur` events to be emitted
            if (!this.forElement_.getAttribute('tabindex')) {
                this.forElement_.setAttribute('tabindex', '0');
            }
            this.boundMouseEnterHandler = this.handleMouseEnter_.bind(this);
            this.boundMouseLeaveHandler = this.handleMouseLeave_.bind(this);
            this.forElement_.addEventListener('mouseenter', this.boundMouseEnterHandler, false);
            this.forElement_.addEventListener('click', this.boundMouseEnterHandler, false);
            this.forElement_.addEventListener('blur', this.boundMouseLeaveHandler);
            this.forElement_.addEventListener('touchstart', this.boundMouseEnterHandler, false);
            this.forElement_.addEventListener('mouseleave', this.boundMouseLeaveHandler);
        }
    }
};
/**
   * Downgrade the component
   *
   * @private
   */
MaterialTooltip.prototype.mdlDowngrade_ = function () {
    if (this.forElement_) {
        this.forElement_.removeEventListener('mouseenter', this.boundMouseEnterHandler, false);
        this.forElement_.removeEventListener('click', this.boundMouseEnterHandler, false);
        this.forElement_.removeEventListener('touchstart', this.boundMouseEnterHandler, false);
        this.forElement_.removeEventListener('mouseleave', this.boundMouseLeaveHandler);
    }
};
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialTooltip,
    classAsString: 'MaterialTooltip',
    cssClass: 'mdl-tooltip'
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Layout MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @param {HTMLElement} element The element that will be upgraded.
   */
var MaterialLayout = function MaterialLayout(element) {
    this.element_ = element;
    // Initialize instance.
    this.init();
};
window.MaterialLayout = MaterialLayout;
/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {String | Number}
   * @private
   */
MaterialLayout.prototype.Constant_ = {
    MAX_WIDTH: '(max-width: 1024px)',
    TAB_SCROLL_PIXELS: 100,
    MENU_ICON: 'menu',
    CHEVRON_LEFT: 'chevron_left',
    CHEVRON_RIGHT: 'chevron_right'
};
/**
   * Modes.
   *
   * @enum {Number}
   * @private
   */
MaterialLayout.prototype.Mode_ = {
    STANDARD: 0,
    SEAMED: 1,
    WATERFALL: 2,
    SCROLL: 3
};
/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {String}
   * @private
   */
MaterialLayout.prototype.CssClasses_ = {
    CONTAINER: 'mdl-layout__container',
    HEADER: 'mdl-layout__header',
    DRAWER: 'mdl-layout__drawer',
    CONTENT: 'mdl-layout__content',
    DRAWER_BTN: 'mdl-layout__drawer-button',
    ICON: 'material-icons',
    JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
    RIPPLE_CONTAINER: 'mdl-layout__tab-ripple-container',
    RIPPLE: 'mdl-ripple',
    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
    HEADER_SEAMED: 'mdl-layout__header--seamed',
    HEADER_WATERFALL: 'mdl-layout__header--waterfall',
    HEADER_SCROLL: 'mdl-layout__header--scroll',
    FIXED_HEADER: 'mdl-layout--fixed-header',
    OBFUSCATOR: 'mdl-layout__obfuscator',
    TAB_BAR: 'mdl-layout__tab-bar',
    TAB_CONTAINER: 'mdl-layout__tab-bar-container',
    TAB: 'mdl-layout__tab',
    TAB_BAR_BUTTON: 'mdl-layout__tab-bar-button',
    TAB_BAR_LEFT_BUTTON: 'mdl-layout__tab-bar-left-button',
    TAB_BAR_RIGHT_BUTTON: 'mdl-layout__tab-bar-right-button',
    PANEL: 'mdl-layout__tab-panel',
    HAS_DRAWER: 'has-drawer',
    HAS_TABS: 'has-tabs',
    HAS_SCROLLING_HEADER: 'has-scrolling-header',
    CASTING_SHADOW: 'is-casting-shadow',
    IS_COMPACT: 'is-compact',
    IS_SMALL_SCREEN: 'is-small-screen',
    IS_DRAWER_OPEN: 'is-visible',
    IS_ACTIVE: 'is-active',
    IS_UPGRADED: 'is-upgraded',
    IS_ANIMATING: 'is-animating',
    ON_LARGE_SCREEN: 'mdl-layout--large-screen-only',
    ON_SMALL_SCREEN: 'mdl-layout--small-screen-only'
};
/**
   * Handles scrolling on the content.
   *
   * @private
   */
MaterialLayout.prototype.contentScrollHandler_ = function () {
    if (this.header_.classList.contains(this.CssClasses_.IS_ANIMATING)) {
        return;
    }
    if (this.content_.scrollTop > 0 && !this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
        this.header_.classList.add(this.CssClasses_.CASTING_SHADOW);
        this.header_.classList.add(this.CssClasses_.IS_COMPACT);
        this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
    } else if (this.content_.scrollTop <= 0 && this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
        this.header_.classList.remove(this.CssClasses_.CASTING_SHADOW);
        this.header_.classList.remove(this.CssClasses_.IS_COMPACT);
        this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
    }
};
/**
   * Handles changes in screen size.
   *
   * @private
   */
MaterialLayout.prototype.screenSizeHandler_ = function () {
    if (this.screenSizeMediaQuery_.matches) {
        this.element_.classList.add(this.CssClasses_.IS_SMALL_SCREEN);
    } else {
        this.element_.classList.remove(this.CssClasses_.IS_SMALL_SCREEN);
        // Collapse drawer (if any) when moving to a large screen size.
        if (this.drawer_) {
            this.drawer_.classList.remove(this.CssClasses_.IS_DRAWER_OPEN);
        }
    }
};
/**
   * Handles toggling of the drawer.
   *
   * @private
   */
MaterialLayout.prototype.drawerToggleHandler_ = function () {
    this.drawer_.classList.toggle(this.CssClasses_.IS_DRAWER_OPEN);
};
/**
   * Handles (un)setting the `is-animating` class
   *
   * @private
   */
MaterialLayout.prototype.headerTransitionEndHandler_ = function () {
    this.header_.classList.remove(this.CssClasses_.IS_ANIMATING);
};
/**
   * Handles expanding the header on click
   *
   * @private
   */
MaterialLayout.prototype.headerClickHandler_ = function () {
    if (this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
        this.header_.classList.remove(this.CssClasses_.IS_COMPACT);
        this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
    }
};
/**
   * Reset tab state, dropping active classes
   *
   * @private
   */
MaterialLayout.prototype.resetTabState_ = function (tabBar) {
    for (var k = 0; k < tabBar.length; k++) {
        tabBar[k].classList.remove(this.CssClasses_.IS_ACTIVE);
    }
};
/**
   * Reset panel state, droping active classes
   *
   * @private
   */
MaterialLayout.prototype.resetPanelState_ = function (panels) {
    for (var j = 0; j < panels.length; j++) {
        panels[j].classList.remove(this.CssClasses_.IS_ACTIVE);
    }
};
/**
   * Initialize element.
   */
MaterialLayout.prototype.init = function () {
    if (this.element_) {
        var container = document.createElement('div');
        container.classList.add(this.CssClasses_.CONTAINER);
        this.element_.parentElement.insertBefore(container, this.element_);
        this.element_.parentElement.removeChild(this.element_);
        container.appendChild(this.element_);
        var directChildren = this.element_.childNodes;
        for (var c = 0; c < directChildren.length; c++) {
            var child = directChildren[c];
            if (child.classList && child.classList.contains(this.CssClasses_.HEADER)) {
                this.header_ = child;
            }
            if (child.classList && child.classList.contains(this.CssClasses_.DRAWER)) {
                this.drawer_ = child;
            }
            if (child.classList && child.classList.contains(this.CssClasses_.CONTENT)) {
                this.content_ = child;
            }
        }
        if (this.header_) {
            this.tabBar_ = this.header_.querySelector('.' + this.CssClasses_.TAB_BAR);
        }
        var mode = this.Mode_.STANDARD;
        // Keep an eye on screen size, and add/remove auxiliary class for styling
        // of small screens.
        this.screenSizeMediaQuery_ = window.matchMedia(this.Constant_.MAX_WIDTH);
        this.screenSizeMediaQuery_.addListener(this.screenSizeHandler_.bind(this));
        this.screenSizeHandler_();
        if (this.header_) {
            if (this.header_.classList.contains(this.CssClasses_.HEADER_SEAMED)) {
                mode = this.Mode_.SEAMED;
            } else if (this.header_.classList.contains(this.CssClasses_.HEADER_WATERFALL)) {
                mode = this.Mode_.WATERFALL;
                this.header_.addEventListener('transitionend', this.headerTransitionEndHandler_.bind(this));
                this.header_.addEventListener('click', this.headerClickHandler_.bind(this));
            } else if (this.header_.classList.contains(this.CssClasses_.HEADER_SCROLL)) {
                mode = this.Mode_.SCROLL;
                container.classList.add(this.CssClasses_.HAS_SCROLLING_HEADER);
            }
            if (mode === this.Mode_.STANDARD) {
                this.header_.classList.add(this.CssClasses_.CASTING_SHADOW);
                if (this.tabBar_) {
                    this.tabBar_.classList.add(this.CssClasses_.CASTING_SHADOW);
                }
            } else if (mode === this.Mode_.SEAMED || mode === this.Mode_.SCROLL) {
                this.header_.classList.remove(this.CssClasses_.CASTING_SHADOW);
                if (this.tabBar_) {
                    this.tabBar_.classList.remove(this.CssClasses_.CASTING_SHADOW);
                }
            } else if (mode === this.Mode_.WATERFALL) {
                // Add and remove shadows depending on scroll position.
                // Also add/remove auxiliary class for styling of the compact version of
                // the header.
                this.content_.addEventListener('scroll', this.contentScrollHandler_.bind(this));
                this.contentScrollHandler_();
            }
        }
        var eatEvent = function (ev) {
            ev.preventDefault();
        };
        // Add drawer toggling button to our layout, if we have an openable drawer.
        if (this.drawer_) {
            var drawerButton = document.createElement('div');
            drawerButton.classList.add(this.CssClasses_.DRAWER_BTN);
            if (this.drawer_.classList.contains(this.CssClasses_.ON_LARGE_SCREEN)) {
                //If drawer has ON_LARGE_SCREEN class then add it to the drawer toggle button as well.
                drawerButton.classList.add(this.CssClasses_.ON_LARGE_SCREEN);
            } else if (this.drawer_.classList.contains(this.CssClasses_.ON_SMALL_SCREEN)) {
                //If drawer has ON_SMALL_SCREEN class then add it to the drawer toggle button as well.
                drawerButton.classList.add(this.CssClasses_.ON_SMALL_SCREEN);
            }
            var drawerButtonIcon = document.createElement('i');
            drawerButtonIcon.classList.add(this.CssClasses_.ICON);
            drawerButtonIcon.textContent = this.Constant_.MENU_ICON;
            drawerButton.appendChild(drawerButtonIcon);
            drawerButton.addEventListener('click', this.drawerToggleHandler_.bind(this));
            // Add a class if the layout has a drawer, for altering the left padding.
            // Adds the HAS_DRAWER to the elements since this.header_ may or may
            // not be present.
            this.element_.classList.add(this.CssClasses_.HAS_DRAWER);
            this.drawer_.addEventListener('mousewheel', eatEvent);
            // If we have a fixed header, add the button to the header rather than
            // the layout.
            if (this.element_.classList.contains(this.CssClasses_.FIXED_HEADER)) {
                this.header_.insertBefore(drawerButton, this.header_.firstChild);
            } else {
                this.element_.insertBefore(drawerButton, this.content_);
            }
            var obfuscator = document.createElement('div');
            obfuscator.classList.add(this.CssClasses_.OBFUSCATOR);
            this.element_.appendChild(obfuscator);
            obfuscator.addEventListener('click', this.drawerToggleHandler_.bind(this));
            obfuscator.addEventListener('mousewheel', eatEvent);
        }
        // Initialize tabs, if any.
        if (this.header_ && this.tabBar_) {
            this.element_.classList.add(this.CssClasses_.HAS_TABS);
            var tabContainer = document.createElement('div');
            tabContainer.classList.add(this.CssClasses_.TAB_CONTAINER);
            this.header_.insertBefore(tabContainer, this.tabBar_);
            this.header_.removeChild(this.tabBar_);
            var leftButton = document.createElement('div');
            leftButton.classList.add(this.CssClasses_.TAB_BAR_BUTTON);
            leftButton.classList.add(this.CssClasses_.TAB_BAR_LEFT_BUTTON);
            var leftButtonIcon = document.createElement('i');
            leftButtonIcon.classList.add(this.CssClasses_.ICON);
            leftButtonIcon.textContent = this.Constant_.CHEVRON_LEFT;
            leftButton.appendChild(leftButtonIcon);
            leftButton.addEventListener('click', function () {
                this.tabBar_.scrollLeft -= this.Constant_.TAB_SCROLL_PIXELS;
            }.bind(this));
            var rightButton = document.createElement('div');
            rightButton.classList.add(this.CssClasses_.TAB_BAR_BUTTON);
            rightButton.classList.add(this.CssClasses_.TAB_BAR_RIGHT_BUTTON);
            var rightButtonIcon = document.createElement('i');
            rightButtonIcon.classList.add(this.CssClasses_.ICON);
            rightButtonIcon.textContent = this.Constant_.CHEVRON_RIGHT;
            rightButton.appendChild(rightButtonIcon);
            rightButton.addEventListener('click', function () {
                this.tabBar_.scrollLeft += this.Constant_.TAB_SCROLL_PIXELS;
            }.bind(this));
            tabContainer.appendChild(leftButton);
            tabContainer.appendChild(this.tabBar_);
            tabContainer.appendChild(rightButton);
            // Add and remove buttons depending on scroll position.
            var tabScrollHandler = function () {
                if (this.tabBar_.scrollLeft > 0) {
                    leftButton.classList.add(this.CssClasses_.IS_ACTIVE);
                } else {
                    leftButton.classList.remove(this.CssClasses_.IS_ACTIVE);
                }
                if (this.tabBar_.scrollLeft < this.tabBar_.scrollWidth - this.tabBar_.offsetWidth) {
                    rightButton.classList.add(this.CssClasses_.IS_ACTIVE);
                } else {
                    rightButton.classList.remove(this.CssClasses_.IS_ACTIVE);
                }
            }.bind(this);
            this.tabBar_.addEventListener('scroll', tabScrollHandler);
            tabScrollHandler();
            if (this.tabBar_.classList.contains(this.CssClasses_.JS_RIPPLE_EFFECT)) {
                this.tabBar_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
            }
            // Select element tabs, document panels
            var tabs = this.tabBar_.querySelectorAll('.' + this.CssClasses_.TAB);
            var panels = this.content_.querySelectorAll('.' + this.CssClasses_.PANEL);
            // Create new tabs for each tab element
            for (var i = 0; i < tabs.length; i++) {
                new MaterialLayoutTab(tabs[i], tabs, panels, this);
            }
        }
        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
};
function MaterialLayoutTab(tab, tabs, panels, layout) {
    if (tab) {
        if (layout.tabBar_.classList.contains(layout.CssClasses_.JS_RIPPLE_EFFECT)) {
            var rippleContainer = document.createElement('span');
            rippleContainer.classList.add(layout.CssClasses_.RIPPLE_CONTAINER);
            rippleContainer.classList.add(layout.CssClasses_.JS_RIPPLE_EFFECT);
            var ripple = document.createElement('span');
            ripple.classList.add(layout.CssClasses_.RIPPLE);
            rippleContainer.appendChild(ripple);
            tab.appendChild(rippleContainer);
        }
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            var href = tab.href.split('#')[1];
            var panel = layout.content_.querySelector('#' + href);
            layout.resetTabState_(tabs);
            layout.resetPanelState_(panels);
            tab.classList.add(layout.CssClasses_.IS_ACTIVE);
            panel.classList.add(layout.CssClasses_.IS_ACTIVE);
        });
    }
}
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialLayout,
    classAsString: 'MaterialLayout',
    cssClass: 'mdl-js-layout'
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Data Table Card MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @param {HTMLElement} element The element that will be upgraded.
   */
var MaterialDataTable = function MaterialDataTable(element) {
    this.element_ = element;
    // Initialize instance.
    this.init();
};
window.MaterialDataTable = MaterialDataTable;
/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {String | Number}
   * @private
   */
MaterialDataTable.prototype.Constant_ = {};
/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {String}
   * @private
   */
MaterialDataTable.prototype.CssClasses_ = {
    DATA_TABLE: 'mdl-data-table',
    SELECTABLE: 'mdl-data-table--selectable',
    IS_SELECTED: 'is-selected',
    IS_UPGRADED: 'is-upgraded'
};
/**
   * Generates and returns a function that toggles the selection state of a
   * single row (or multiple rows).
   *
   * @param {HTMLElement} checkbox Checkbox that toggles the selection state.
   * @param {HTMLElement} row Row to toggle when checkbox changes.
   * @param {HTMLElement[]} rows Rows to toggle when checkbox changes.
   * @private
   */
MaterialDataTable.prototype.selectRow_ = function (checkbox, row, rows) {
    if (row) {
        return function () {
            if (checkbox.checked) {
                row.classList.add(this.CssClasses_.IS_SELECTED);
            } else {
                row.classList.remove(this.CssClasses_.IS_SELECTED);
            }
        }.bind(this);
    }
    if (rows) {
        return function () {
            var i;
            var el;
            if (checkbox.checked) {
                for (i = 0; i < rows.length; i++) {
                    el = rows[i].querySelector('td').querySelector('.mdl-checkbox');
                    el.MaterialCheckbox.check();
                    rows[i].classList.add(this.CssClasses_.IS_SELECTED);
                }
            } else {
                for (i = 0; i < rows.length; i++) {
                    el = rows[i].querySelector('td').querySelector('.mdl-checkbox');
                    el.MaterialCheckbox.uncheck();
                    rows[i].classList.remove(this.CssClasses_.IS_SELECTED);
                }
            }
        }.bind(this);
    }
};
/**
   * Creates a checkbox for a single or or multiple rows and hooks up the
   * event handling.
   *
   * @param {HTMLElement} row Row to toggle when checkbox changes.
   * @param {HTMLElement[]} rows Rows to toggle when checkbox changes.
   * @private
   */
MaterialDataTable.prototype.createCheckbox_ = function (row, rows) {
    var label = document.createElement('label');
    label.classList.add('mdl-checkbox');
    label.classList.add('mdl-js-checkbox');
    label.classList.add('mdl-js-ripple-effect');
    label.classList.add('mdl-data-table__select');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('mdl-checkbox__input');
    if (row) {
        checkbox.addEventListener('change', this.selectRow_(checkbox, row));
    } else if (rows) {
        checkbox.addEventListener('change', this.selectRow_(checkbox, null, rows));
    }
    label.appendChild(checkbox);
    componentHandler.upgradeElement(label, 'MaterialCheckbox');
    return label;
};
/**
   * Initialize element.
   */
MaterialDataTable.prototype.init = function () {
    if (this.element_) {
        var firstHeader = this.element_.querySelector('th');
        var rows = this.element_.querySelector('tbody').querySelectorAll('tr');
        if (this.element_.classList.contains(this.CssClasses_.SELECTABLE)) {
            var th = document.createElement('th');
            var headerCheckbox = this.createCheckbox_(null, rows);
            th.appendChild(headerCheckbox);
            firstHeader.parentElement.insertBefore(th, firstHeader);
            for (var i = 0; i < rows.length; i++) {
                var firstCell = rows[i].querySelector('td');
                if (firstCell) {
                    var td = document.createElement('td');
                    var rowCheckbox = this.createCheckbox_(rows[i]);
                    td.appendChild(rowCheckbox);
                    rows[i].insertBefore(td, firstCell);
                }
            }
        }
        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
};
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialDataTable,
    classAsString: 'MaterialDataTable',
    cssClass: 'mdl-js-data-table'
});
/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
   * Class constructor for Ripple MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @param {HTMLElement} element The element that will be upgraded.
   */
var MaterialRipple = function MaterialRipple(element) {
    this.element_ = element;
    // Initialize instance.
    this.init();
};
window.MaterialRipple = MaterialRipple;
/**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {String | Number}
   * @private
   */
MaterialRipple.prototype.Constant_ = {
    INITIAL_SCALE: 'scale(0.0001, 0.0001)',
    INITIAL_SIZE: '1px',
    INITIAL_OPACITY: '0.4',
    FINAL_OPACITY: '0',
    FINAL_SCALE: ''
};
/**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {String}
   * @private
   */
MaterialRipple.prototype.CssClasses_ = {
    RIPPLE_CENTER: 'mdl-ripple--center',
    RIPPLE_EFFECT_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
    RIPPLE: 'mdl-ripple',
    IS_ANIMATING: 'is-animating',
    IS_VISIBLE: 'is-visible'
};
/**
   * Handle mouse / finger down on element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialRipple.prototype.downHandler_ = function (event) {
    if (!this.rippleElement_.style.width && !this.rippleElement_.style.height) {
        var rect = this.element_.getBoundingClientRect();
        this.boundHeight = rect.height;
        this.boundWidth = rect.width;
        this.rippleSize_ = Math.sqrt(rect.width * rect.width + rect.height * rect.height) * 2 + 2;
        this.rippleElement_.style.width = this.rippleSize_ + 'px';
        this.rippleElement_.style.height = this.rippleSize_ + 'px';
    }
    this.rippleElement_.classList.add(this.CssClasses_.IS_VISIBLE);
    if (event.type === 'mousedown' && this.ignoringMouseDown_) {
        this.ignoringMouseDown_ = false;
    } else {
        if (event.type === 'touchstart') {
            this.ignoringMouseDown_ = true;
        }
        var frameCount = this.getFrameCount();
        if (frameCount > 0) {
            return;
        }
        this.setFrameCount(1);
        var bound = event.currentTarget.getBoundingClientRect();
        var x;
        var y;
        // Check if we are handling a keyboard click.
        if (event.clientX === 0 && event.clientY === 0) {
            x = Math.round(bound.width / 2);
            y = Math.round(bound.height / 2);
        } else {
            var clientX = event.clientX ? event.clientX : event.touches[0].clientX;
            var clientY = event.clientY ? event.clientY : event.touches[0].clientY;
            x = Math.round(clientX - bound.left);
            y = Math.round(clientY - bound.top);
        }
        this.setRippleXY(x, y);
        this.setRippleStyles(true);
        window.requestAnimationFrame(this.animFrameHandler.bind(this));
    }
};
/**
   * Handle mouse / finger up on element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
MaterialRipple.prototype.upHandler_ = function (event) {
    // Don't fire for the artificial "mouseup" generated by a double-click.
    if (event && event.detail !== 2) {
        this.rippleElement_.classList.remove(this.CssClasses_.IS_VISIBLE);
    }
    // Allow a repaint to occur before removing this class, so the animation
    // shows for tap events, which seem to trigger a mouseup too soon after
    // mousedown.
    window.setTimeout(function () {
        this.rippleElement_.classList.remove(this.CssClasses_.IS_VISIBLE);
    }.bind(this), 0);
};
/**
   * Initialize element.
   */
MaterialRipple.prototype.init = function () {
    if (this.element_) {
        var recentering = this.element_.classList.contains(this.CssClasses_.RIPPLE_CENTER);
        if (!this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT_IGNORE_EVENTS)) {
            this.rippleElement_ = this.element_.querySelector('.' + this.CssClasses_.RIPPLE);
            this.frameCount_ = 0;
            this.rippleSize_ = 0;
            this.x_ = 0;
            this.y_ = 0;
            // Touch start produces a compat mouse down event, which would cause a
            // second ripples. To avoid that, we use this property to ignore the first
            // mouse down after a touch start.
            this.ignoringMouseDown_ = false;
            this.boundDownHandler = this.downHandler_.bind(this);
            this.element_.addEventListener('mousedown', this.boundDownHandler);
            this.element_.addEventListener('touchstart', this.boundDownHandler);
            this.boundUpHandler = this.upHandler_.bind(this);
            this.element_.addEventListener('mouseup', this.boundUpHandler);
            this.element_.addEventListener('mouseleave', this.boundUpHandler);
            this.element_.addEventListener('touchend', this.boundUpHandler);
            this.element_.addEventListener('blur', this.boundUpHandler);
            this.getFrameCount = function () {
                return this.frameCount_;
            };
            this.setFrameCount = function (fC) {
                this.frameCount_ = fC;
            };
            this.getRippleElement = function () {
                return this.rippleElement_;
            };
            this.setRippleXY = function (newX, newY) {
                this.x_ = newX;
                this.y_ = newY;
            };
            this.setRippleStyles = function (start) {
                if (this.rippleElement_ !== null) {
                    var transformString;
                    var scale;
                    var size;
                    var offset = 'translate(' + this.x_ + 'px, ' + this.y_ + 'px)';
                    if (start) {
                        scale = this.Constant_.INITIAL_SCALE;
                        size = this.Constant_.INITIAL_SIZE;
                    } else {
                        scale = this.Constant_.FINAL_SCALE;
                        size = this.rippleSize_ + 'px';
                        if (recentering) {
                            offset = 'translate(' + this.boundWidth / 2 + 'px, ' + this.boundHeight / 2 + 'px)';
                        }
                    }
                    transformString = 'translate(-50%, -50%) ' + offset + scale;
                    this.rippleElement_.style.webkitTransform = transformString;
                    this.rippleElement_.style.msTransform = transformString;
                    this.rippleElement_.style.transform = transformString;
                    if (start) {
                        this.rippleElement_.classList.remove(this.CssClasses_.IS_ANIMATING);
                    } else {
                        this.rippleElement_.classList.add(this.CssClasses_.IS_ANIMATING);
                    }
                }
            };
            this.animFrameHandler = function () {
                if (this.frameCount_-- > 0) {
                    window.requestAnimationFrame(this.animFrameHandler.bind(this));
                } else {
                    this.setRippleStyles(false);
                }
            };
        }
    }
};
/**
   * Downgrade the component
   *
   * @private
   */
MaterialRipple.prototype.mdlDowngrade_ = function () {
    this.element_.removeEventListener('mousedown', this.boundDownHandler);
    this.element_.removeEventListener('touchstart', this.boundDownHandler);
    this.element_.removeEventListener('mouseup', this.boundUpHandler);
    this.element_.removeEventListener('mouseleave', this.boundUpHandler);
    this.element_.removeEventListener('touchend', this.boundUpHandler);
    this.element_.removeEventListener('blur', this.boundUpHandler);
};
// The component registers itself. It can assume componentHandler is available
// in the global scope.
componentHandler.register({
    constructor: MaterialRipple,
    classAsString: 'MaterialRipple',
    cssClass: 'mdl-js-ripple-effect',
    widget: false
});
}());

(function() {
  console.log('hello');

}).call(this);

console.log('world');