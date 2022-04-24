# Thermal

## Abstract

Linux Thermal 是 Linux 系统下温度控制相关的模块，主要用来控制系统运行中芯片产生的热量。配合 ic 内部温度传感器，对 ic 温度进行管控，保证系统稳定性[^1]。

其基本的架构可以简单概括为下图：

![thermal arch](./images/thermal.png)

Thermal 中有一些基础概念，下文对其进行分析。

## Thermal Zone

Thermal Zone 代表一个温控区间，将其看成一个虚拟的温度 sensor, 但是需要有物理 sensor 与其关联才可以发挥作用。 需要注意的是，一个 Thermal zone 最多可以关联一个 sensor, 但是一个 sensor 可以是多个硬件 Sensor 的混合。

🤔🤔🤔 为什么一个 Thermal zone 只能关联一个 sensor? 系统中会有多个 Thermal zone 吗？

### Thermal Zone Device

Thermal Zone Device 在 Thermal 框架中理解为**获取温度的设备**。

### Trip point

> The binding of the cooling devices to the trip point is left for the user.

触发点由 Thermal Zone 维护，每个 Thermal Zone 可以维护多个 Trip Point, 其包含的信息有：

- temp: 当前温度

- type: 类型，有以下方式：passive、active、hot、critical

- cooling device: 绑定信息。

    这个绑定信息指的是 Trip Point 和 cooling device 的绑定关系，即当 Trip Point 触发后由哪个 cooling device 去实施冷却措施。每个 Trip Point 要与 cooling device 绑定，才有其实际意义。

    cooling device 是实际对系统实施冷却措施的驱动，是温控的执行者。cooling device 维护一个 cooling 等级 state, state 越高则表示系统的冷却需求越高（注意到 cooling device 只根据 state 进行冷却操作）。

    🤔🤔🤔 state 这个取值是由谁决定的？state 的计算由 Thermal Governor 完成。

### Source Code

dts 的配置：

@[code{1-13}](./code/thermal_zone.dts)

上述代码为拷贝过来的，具体的理解，目前如下：

1. 轮询时间有 2 个，如果超过了温度阈值，则缩短轮询的时间。
2. @todo


## Thermal Governal

Thermal Governal 是降温策略的一个抽象，与 cpufreq 的 governal 概念类似。

内核实现的策略定义如下：

(仅仅举例用，不是最新的代码实现，废弃)

```c
struct thermal_governor {
        char name[THERMAL_NAME_LENGTH];
        /* 策略函数 */
        int (*throttle)(struct thermal_zone_device *tz, int trip);
        struct list_head governor_list;
};
```

## Thermal Cooling Device

Thermal Cooling Device 是可以降温设备的抽象，如风扇。除此之外，还会包括CPU、GPU 这些，如何理解呢？

散热的方式有两种，一种是加快散热，一种是降低产热量，CPU、GPU 就是后者的体现。

```c
struct thermal_cooling_device {
    int id;
    char type[THERMAL_NAME_LENGTH];
    struct device device;
    struct device_node *np;
    void *devdata;
    /* cooling device 操作函数 */
    const struct thermal_cooling_device_ops *ops;
    bool updated; /* true if the cooling device does not need update */
    struct mutex lock; /* protect thermal_instances list */
    struct list_head thermal_instances;
    struct list_head node;
};

struct thermal_cooling_device_ops {
    int (*get_max_state) (struct thermal_cooling_device *, unsigned long *);
    int (*get_cur_state) (struct thermal_cooling_device *, unsigned long *);
    /* 设定等级 */
    int (*set_cur_state) (struct thermal_cooling_device *, unsigned long);
};
```

## Thermal Core

Thermal Core 作为中枢注册 Governor, 注册 Thermal 类，并且基于 Device Tree 注册 Thermal Zone;

除此之外，提供 Thermal Zone 注册函数、Cooling Device 注册函数、提供将 Cooling 设备绑定到 Zone 的函数，一个 Thermal Zone 可以有多个 Cooling 设备；

提供了核心函数 thermal_zone_device_update 作为 Thermal 中断处理函数和轮询函数，轮询的时候会根据不同 Trip Delay 调节。

## thermal.h

### thermal_zone_device

```c
/**
 * struct thermal_zone_device - structure for a thermal zone
 * @id:		unique id number for each thermal zone
 * @type:	the thermal zone device type
 * @device:	&struct device for this thermal zone
 * @trip_temp_attrs:	attributes for trip points for sysfs: trip temperature
 * @trip_type_attrs:	attributes for trip points for sysfs: trip type
 * @trip_hyst_attrs:	attributes for trip points for sysfs: trip hysteresis
 * @mode:		current mode of this thermal zone
 * @devdata:	private pointer for device private data
 * @trips:	number of trip points the thermal zone supports
 * @trips_disabled;	bitmap for disabled trips
 * @passive_delay_jiffies: number of jiffies to wait between polls when
 *			performing passive cooling.
 * @polling_delay_jiffies: number of jiffies to wait between polls when
 *			checking whether trip points have been crossed (0 for
 *			interrupt driven systems)
 * @temperature:	current temperature.  This is only for core code,
 *			drivers should use thermal_zone_get_temp() to get the
 *			current temperature
 * @last_temperature:	previous temperature read
 * @emul_temperature:	emulated temperature when using CONFIG_THERMAL_EMULATION
 * @passive:		1 if you've crossed a passive trip point, 0 otherwise.
 * @prev_low_trip:	the low current temperature if you've crossed a passive
			trip point.
 * @prev_high_trip:	the above current temperature if you've crossed a
			passive trip point.
 * @need_update:	if equals 1, thermal_zone_device_update needs to be invoked.
 * @ops:	operations this &thermal_zone_device supports
 * @tzp:	thermal zone parameters
 * @governor:	pointer to the governor for this thermal zone
 * @governor_data:	private pointer for governor data
 * @thermal_instances:	list of &struct thermal_instance of this thermal zone
 * @ida:	&struct ida to generate unique id for this zone's cooling
 *		devices
 * @lock:	lock to protect thermal_instances list
 * @node:	node in thermal_tz_list (in thermal_core.c)
 * @poll_queue:	delayed work for polling
 * @notify_event: Last notification event
 */
struct thermal_zone_device {
}
```

其中一些重点参数需要单独研究。

#### @tzp

`struct thermal_zone_params *tzp` 结构体细节如下：

```c
/* Structure to define Thermal Zone parameters */
struct thermal_zone_params {
	char governor_name[THERMAL_NAME_LENGTH];

	/*
	 * a boolean to indicate if the thermal to hwmon sysfs interface
	 * is required. when no_hwmon == false, a hwmon sysfs interface
	 * will be created. when no_hwmon == true, nothing will be done
	 */
	bool no_hwmon;

	int num_tbps;	/* Number of tbp entries */
	struct thermal_bind_params *tbp;

	/*
	 * Sustainable power (heat) that this thermal zone can dissipate in
	 * mW
	 */
	u32 sustainable_power;

	/*
	 * Proportional parameter of the PID controller when
	 * overshooting (i.e., when temperature is below the target)
	 */
	s32 k_po;

	/*
	 * Proportional parameter of the PID controller when
	 * undershooting
	 */
	s32 k_pu;

	/* Integral parameter of the PID controller */
	s32 k_i;

	/* Derivative parameter of the PID controller */
	s32 k_d;

	/* threshold below which the error is no longer accumulated */
	s32 integral_cutoff;

	/*
	 * @slope:	slope of a linear temperature adjustment curve.
	 * 		Used by thermal zone drivers.
	 */
	int slope;
	/*
	 * @offset:	offset of a linear temperature adjustment curve.
	 * 		Used by thermal zone drivers (default 0).
	 */
	int offset;
};
```

如寻找对应的 governor: `governor = __find_governor(tz->tzp->governor_name);` 就用到了 `tzp->governor_name` 这个参数。


## thermal_core.h

### struct thermal_governor

对于 `thermal_governor` 结构体组成如下：

```c
/**
 * struct thermal_governor - structure that holds thermal governor information
 * @name:	name of the governor
 * @bind_to_tz: callback called when binding to a thermal zone.  If it
 *		returns 0, the governor is bound to the thermal zone,
 *		otherwise it fails.
 * @unbind_from_tz:	callback called when a governor is unbound from a
 *			thermal zone.
 * @throttle:	callback called for every trip point even if temperature is
 *		below the trip point temperature
 * @governor_list:	node in thermal_governor_list (in thermal_core.c)
 */
struct thermal_governor {
	char name[THERMAL_NAME_LENGTH];
	int (*bind_to_tz)(struct thermal_zone_device *tz);
	void (*unbind_from_tz)(struct thermal_zone_device *tz);
	int (*throttle)(struct thermal_zone_device *tz, int trip);
	struct list_head	governor_list;
};
```

- `name`: thermal governor 名称

- `bind_to_tz`: 回调函数，callback called when binding to a thermal zone. 如果返回 `0`, 则 governor 绑定到 thermal zone 成功，否则失败

- `unbind_from_tz`: 解绑回调函数

- `throttle`: 
  callback called for every trip point even if temperature is below the trip point temperature. 意思就是说，每个触发点的回调，即使是温度低于触发点温度，也会回调这个函数;
  在有些解释中，`throttle` 被认为是策略函数，其参数传入 `int (*thermal_governor::throttle)`

- `governor_list`: governor 列表

`list_head` 结构体定义如下：

```c
struct list_head {
	struct list_head *next, *prev;
};
```

## thermel_core.c


### __find_governor

```c
static struct thermal_governor *__find_governor(const char *name) {
	struct thermal_governor *pos;

	if (!name || !name[0])
		return def_governor;

	list_for_each_entry(pos, &thermal_governor_list, governor_list)
		if (!strncasecmp(name, pos->name, THERMAL_NAME_LENGTH))
			return pos;

	return NULL;
}
```

预设 `static struct thermal_governor *def_governor;` 没有传入 `name` 的时候返回预设的 governor.

传入 `name` 的话，进行名称循环校验，和 `LIST_HEAD` 中的进行对比。


调用地方：

1. `int thermal_register_governor(struct thermal_governor *governor)`

2. `void thermal_unregister_governor(struct thermal_governor *governor)`

3. `int thermal_zone_device_set_policy(struct thermal_zone_device *tz, char *policy)`

    `policy` 作为 `governor` 的名称传入，进行了 `strim(policy)` 操作。

4. `thermal_zone_device_register`

总结一下，`__find_governor` 主要的作用是根据 policy 去拿到对应的 governor, 如果 policy 是不存在的，则从预先设置的里面返回。

❌❌❌ 了解预先设置的返回什么？

### thermal_register_governor

函数定义如下：`int thermal_register_governor(struct thermal_governor *governor)`.

注册 governor 实现了几件事：

1. 根据传入的 governor 去查找，调用 `__find_governor`, 传入的 governor 名称是否有对应的存在，存在于什么地方呢？`thermal_governor_list`, 这个 list 是一个静态的 `static LIST_HEAD(thermal_governor_list);` 不存在的 governor 会被添加进去
2. 找到的话，把 governor -> governor_list 放到 thermal_governor_list 中去

对于 `thermal_unregister_governor` 道理相似，不再赘述。

### thermal_zone_device_set_policy

```c
int thermal_zone_device_set_policy(struct thermal_zone_device *tz, char *policy){
    // ...
}
```

`*tz`: thermal zone device

`policy`: 根据这个去找到 thermal_governor, 如下所示：

```c
struct thermal_governor *gov;

gov = __find_governor(strim(policy));
```

`policy` 作为 governor 的名称去寻找对应的 governor.


如果成功找到的话，调用 `thermal_set_governor`.

### thermal_set_governor

> thermal_set_governor() - Switch to another governor

```c
/**
 * thermal_set_governor() - Switch to another governor
 * @tz:		a valid pointer to a struct thermal_zone_device
 * @new_gov:	pointer to the new governor
 *
 * Change the governor of thermal zone @tz.
 *
 * Return: 0 on success, an error if the new governor's bind_to_tz() failed.
 */
static int thermal_set_governor(struct thermal_zone_device *tz, struct thermal_governor *new_gov) {
    // code
}
```

先解绑 tz 之前的 governor, 再绑定 new_gov 到其中，绑定解绑分别对应的写法为：

```c
// unbind
tz->governor->unbind_from_tz(tz);

// bind
ret = new_gov->bind_to_tz(tz);
```

### thermal_zone_device_register

```c
/**
 * thermal_zone_device_register() - register a new thermal zone device
 * @type:	the thermal zone device type
 * @trips:	the number of trip points the thermal zone support
 * @mask:	a bit string indicating the writeablility of trip points
 * @devdata:	private device data
 * @ops:	standard thermal zone device callbacks
 * @tzp:	thermal zone platform parameters
 * @passive_delay: number of milliseconds to wait between polls when
 *		   performing passive cooling
 * @polling_delay: number of milliseconds to wait between polls when checking
 *		   whether trip points have been crossed (0 for interrupt
 *		   driven systems)
 *
 * This interface function adds a new thermal zone device (sensor) to
 * /sys/class/thermal folder as thermal_zone[0-*]. It tries to bind all the
 * thermal cooling devices registered at the same time.
 * thermal_zone_device_unregister() must be called when the device is no
 * longer needed. The passive cooling depends on the .get_trend() return value.
 *
 * Return: a pointer to the created struct thermal_zone_device or an
 * in case of error, an ERR_PTR. Caller must check return value with
 * IS_ERR*() helpers.
 */
struct thermal_zone_device *
thermal_zone_device_register(const char *type, int trips, int mask,
			     void *devdata, struct thermal_zone_device_ops *ops,
			     struct thermal_zone_params *tzp, int passive_delay,
			     int polling_delay)
{
    // code
}
```

@type: 如 soc_thermal

如注释所示，这个接口实现了增加一个新的 thermal zone device(sensor), 位置在 `/sys/class/thermal `, 其中每个文件夹的名称都类似于 `thermal_zone[0-*]`, 如 `thermal_zone0` 这样。



## Reference

[^1]: [Linux电源管理（五）thermal](https://www.it610.com/article/1288705954065489920.htm)
