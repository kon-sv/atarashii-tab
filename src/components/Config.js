import React, { useEffect, useContext } from "react"
import { FaExclamationTriangle, FaSync, FaThumbtack, FaCog, FaEye, FaUserSecret } from "react-icons/fa"

import AppContext from "../contexts/AppContext"

import "./styles/Config.scss"

const ValuePicker = ({ valueKey, values }) => {
  const { cache, setCache, config, setConfig, loaded, setLoaded } =
    useContext(AppContext)

  const curValue = config[valueKey]

  return (
    <div className="hideable">
      {values
        .map((value) => {
          if (value === curValue)
            return (
              <a key={value} className="selected">
                {value}
              </a>
            )
          else
            return (
              <a
                key={value}
                onClick={(e) => {
                  let newConfig = {
                    ...config,
                    [valueKey]: value,
                    num: null
                  }

                  // Sorting by new on Reddit needs to be all
                  if (valueKey === "sort" && value === "new")
                    newConfig.t = "all"

                  setConfig(newConfig)
                  setCache({
                    lastUpdated: -1,
                    data: [],
                  })
                  setLoaded(false)
                }}
              >
                {value}
              </a>
            )
        })
        .reduce((prev, cur) => [prev, "•", cur])}
    </div>
  )
}

export default () => {
  const { config, setLoaded, setCache, setConfig, data } = useContext(AppContext)

  useEffect(() => {
    if (!config || !data) return

    const action = (e) => {
      if (e.code === 'KeyR' && config.num === null)
        setLoaded(false)
      else if (e.code === 'KeyP')
        setConfig({
          ...config,
          num: config.num !== null ? null : data.num,
        })
      else if (e.code === 'KeyG')
        setConfig({
          ...config,
          hideGui: !config.hideGui
        })
    }

    document.addEventListener('keydown', action)

    return () => {
      document.removeEventListener('keydown', action)
    } 
  }, [config, data])

  return (
    <div className="config">
      <ValuePicker
        valueKey="sort"
        values={["relevance", "hot", "top", "new"]}
      />

      {config.sort !== "new" && (
        <ValuePicker
          valueKey="t"
          values={["hour", "day", "week", "month", "year", "all"]}
        />
      )}

      <span className="buttons">
        <div
          className={"button" + (config.nsfw ? " active" : "")}
          onClick={() => {
            setConfig({
              ...config,
              num: null,
              nsfw: !config.nsfw,
            })
            setCache({
              lastUpdated: -1,
              data: [],
            })
            setLoaded(false)
          }}
        >
          nsfw
          <FaExclamationTriangle size={16} />
        </div>

        <div
          className={"button" + (config.num !== null ? " active" : "")}
          onClick={() => {
            setConfig({
              ...config,
              num: config.num !== null ? null : data.num,
            })
          }}
        >
          pin
          <FaThumbtack size={16} />
        </div>

        <div
          className="button"
          onClick={() => {
            setLoaded(false)
          }}
          disabled={config.num !== null}
        >
          reroll
          <FaSync size={16} />
        </div>

        <div
          className={"button" + (config.incognito ? " active" : "")}
          onClick={() => {
            setConfig({
              ...config,
              incognito: !config.incognito
            })
          }}
        >
          incognito
          <FaUserSecret size={16} />
        </div>

        <div
          className={"button" + (!config.hideGui ? " active" : "")}
          id="btnHideGui"
          onClick={() => {
            setConfig({
              ...config,
              hideGui: !config.hideGui,
            })
          }}
        >
          {!config.hideGui ? "hide" : "show"} gui
          <FaEye size={16} />
        </div>
      </span>

      {/* <span>
        <FaCog size={24} onClick={() => setModalOpen(e => !e)} />
        <p>More Settings</p>
      </span> */}
    </div>
  )
}
